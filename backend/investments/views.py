from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Investment
from .serializers import InvestmentSerializer
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt

import matplotlib.pyplot as plt
import pandas as pd
from io import BytesIO
from .models import Investment 

from django.http import HttpResponse

from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import io
import pandas as pd
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from .env

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from .env
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
print(API_KEY)  
# Initialize Gemini API
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')


@csrf_exempt
def ask(request):
    if request.method == "POST":
        try:
            # Parse JSON body from request
            data = json.loads(request.body)
            prompt = data.get("prompt")

            # Check if prompt exists
            if not prompt:
                return JsonResponse({"response": "Error: prompt is missing or empty"})

            # Generate response using Gemini model
            response = model.generate_content(prompt)

            # Check if response text is generated
            if response.text:
                return JsonResponse({"response": response.text})
            else:
                return JsonResponse({"response": "Sorry, but I think Gemini didn't want to answer that!"})

        except Exception as e:
            return JsonResponse({"response": f"Error: {str(e)}"})
    return JsonResponse({"response": "Invalid request"})

@csrf_exempt
def email_excel(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            # Example investment data
            investments = [
                {'name': 'Stock A', 'value': 1000},
                {'name': 'Stock B', 'value': 2000},
            ]

            # Create Excel file in memory
            df = pd.DataFrame(investments)
            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False, sheet_name='Investments')

            buffer.seek(0)

            # Create and send email
            email_message = EmailMessage(
                subject="Your Investment Portfolio",
                body="Attached is your latest investment portfolio in Excel format.",
                to=[email]
            )
            email_message.attach('portfolio.xlsx', buffer.getvalue(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            email_message.send()

            return JsonResponse({'message': 'Email sent successfully'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)


permission_classes = [IsAuthenticated]

class InvestmentListCreateView(APIView):
    def get(self, request):
        investments = Investment.objects.all()
        serializer = InvestmentSerializer(investments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InvestmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvestmentDetailView(APIView):
    def get_object(self, pk):
        try:
            return Investment.objects.get(pk=pk)
        except Investment.DoesNotExist:
            return None

    def put(self, request, pk):
        investment = self.get_object(pk)
        if investment is None:
            return Response({"error": "Investment not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Retrieve the new value and date from request data
        new_value = request.data.get("current_value")  # Assuming the new stock value is passed here
        new_date = request.data.get("date")  # Assuming the date is passed here (optional)
        
        if new_value is not None:
            # Update the stock value for the given date (if provided)
            investment.add_stock_value(new_value, date=new_date)
            return Response({"message": "Stock value updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "New stock value is required."}, status=status.HTTP_400_BAD_REQUEST)  
              
    def delete(self, request, pk):
        investment = self.get_object(pk)
        if investment is None:
            return Response({"error": "Investment not found."}, status=status.HTTP_404_NOT_FOUND)
        
        investment.delete()
        return Response({"message": "Investment has been deleted."}, status=status.HTTP_204_NO_CONTENT)

class ClearInvestmentsView(APIView):
    def delete(self, request):
        Investment.objects.all().delete()
        return Response({"message": "All investments have been cleared."}, status=status.HTTP_204_NO_CONTENT)

class InvestmentHistoryView(APIView):
    def get(self, request, pk):
        try:
            investment = Investment.objects.get(pk=pk)
        except Investment.DoesNotExist:
            return Response({"error": "Investment not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(investment.value_history)


class DownloadExcelView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this view

    def get(self, request):
        # Retrieve all investments
        investments = Investment.objects.all()
        
        # Convert investments to a Pandas DataFrame
        data = []
        for investment in investments:
            data.append({
                "asset": investment.asset,
                "amount": investment.amount,
                "date": investment.date,
                "current_value": investment.current_value,
                "profit_loss": investment.profit_loss,
                "value_history": investment.value_history,
            })
        
        df = pd.DataFrame(data)
        
        # Convert to Excel
        response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response['Content-Disposition'] = 'attachment; filename=portfolio.xlsx'
        
        # Write the DataFrame to the response as Excel
        with pd.ExcelWriter(response, engine="xlsxwriter") as writer:
            df.to_excel(writer, index=False)
        
        return response
    
@csrf_exempt
@xframe_options_exempt
def generate_investment_graph(request):
    # Fetch all investments from the database
    investments = Investment.objects.all()
    
    data_frames = []
    
    for investment in investments:
        # Extract the value history from the investment's value_history field
        value_history = investment.value_history
        
        investment_data = []
        for entry in value_history:
            # Extract the date and value from the value_history JSON field
            date = entry.get("date")
            value = entry.get("value")
            
            # Ensure value is a valid numeric type (int or float)
            try:
                value = float(value)  # Convert value to float
            except (ValueError, TypeError):
                continue  # Skip if value can't be converted to float
            
            investment_data.append((date, value))
        
        # Convert the data to a Pandas DataFrame
        df = pd.DataFrame(investment_data, columns=['date', 'value'])
        df['date'] = pd.to_datetime(df['date'])
        df['week'] = df['date'].dt.isocalendar().week  # Convert date to week number
        df['asset'] = investment.asset  # Assign the asset name to the 'asset' column
        
        data_frames.append(df)
    
    # Concatenate all individual dataframes
    all_data = pd.concat(data_frames, ignore_index=True)
    
    # Plotting the data as a histogram
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Plot a histogram of investment values for each asset
    for asset in all_data['asset'].unique():
        asset_data = all_data[all_data['asset'] == asset]
        ax.hist(asset_data['value'], bins=10, alpha=0.5, label=asset)
    
    ax.set_title("Investment Value Distribution (Histogram)")
    ax.set_xlabel("Value ($)")
    ax.set_ylabel("Frequency")
    ax.legend(title="Assets")
    
    plt.grid(True)
    
    # Save the plot to a BytesIO object
    image_buffer = BytesIO()
    plt.savefig(image_buffer, format='png')
    image_buffer.seek(0)
    
    # Return the image in the HTTP response as PNG
    response = HttpResponse(image_buffer, content_type='image/png')
    response['Content-Disposition'] = 'attachment; filename="investment_histogram.png"'
    return response
