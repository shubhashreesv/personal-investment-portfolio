from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Investment
from .serializers import InvestmentSerializer

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