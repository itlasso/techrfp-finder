#!/bin/bash

echo "Testing local RFP links..."
echo ""

echo "1. Testing RFP list endpoint:"
curl -s http://localhost:5000/api/rfps | head -50
echo ""
echo ""

echo "2. Testing individual RFP endpoint:"
curl -s http://localhost:5000/api/rfps/a7dbc4d2-d166-4a3a-9882-0c656b3cce7f | head -50
echo ""
echo ""

echo "3. Testing document endpoints:"
echo "University Research document:"
curl -s http://localhost:5000/api/rfps/university-research/document | head -50
echo ""
echo ""

echo "Municipal Portal document:"
curl -s http://localhost:5000/api/rfps/municipal-portal/document | head -50
echo ""
echo ""

echo "Healthcare document:"
curl -s http://localhost:5000/api/rfps/healthcare-data-mgmt/document | head -50