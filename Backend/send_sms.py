# from twilio.rest import Client

# # Your Twilio account SID and auth token
# account_sid = 'AC09d3d6b7fa6d29178d701f5f8c77e5e8'
# auth_token = 'ece1ed1bfcada1706246999ea010e859'

# client = Client(account_sid, auth_token)

# def send_sms(alert_message):
#     message = client.messages.create(
#         body=alert_message,
#         from_='+14159039942',
#         to='+919315539067'  # Replace with the number to send SMS to
#     )
#     print(f"SMS sent: {message.sid}")