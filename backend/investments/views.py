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

import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO

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
    
# Assuming these are your models
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
            investment_data.append((entry["date"], entry["value"]))
        
        # Convert the data to a Pandas DataFrame
        df = pd.DataFrame(investment_data, columns=['date', 'value'])
        df['date'] = pd.to_datetime(df['date'])
        df['week'] = df['date'].dt.isocalendar().week  # Convert date to week number
        df['asset'] = investment.asset  # Assign the asset name to the 'asset' column
        
        data_frames.append(df)
    
    # Concatenate all individual dataframes
    all_data = pd.concat(data_frames, ignore_index=True)
    
    # Plotting the data
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Plot each asset's data
    for asset in all_data['asset'].unique():
        asset_data = all_data[all_data['asset'] == asset]
        ax.plot(asset_data['week'], asset_data['value'], label=asset, marker='o')
    
    ax.set_title("Investment Value by Week")
    ax.set_xlabel("Week Number")
    ax.set_ylabel("Value ($)")
    ax.legend(title="Assets")
    
    plt.grid(True)
    
    # Save the plot to a BytesIO object
    image_buffer = BytesIO()
    plt.savefig(image_buffer, format='png')
    image_buffer.seek(0)
    
    # Return the image in the HTTP response as PNG
    response = HttpResponse(image_buffer, content_type='image/png')
    response['Content-Disposition'] = 'attachment; filename="investment_graph.png"'
    return response