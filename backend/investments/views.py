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
        
        serializer = InvestmentSerializer(investment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
