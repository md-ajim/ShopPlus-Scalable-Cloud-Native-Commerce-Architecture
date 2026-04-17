from firebase_admin import messaging
from .models import FCMToken

def send_notification(user, title, body):

    tokens = FCMToken.objects.filter(user=user).values_list("token", flat=True)

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        tokens=list(tokens)
    )

    messaging.send_multicast(message)
