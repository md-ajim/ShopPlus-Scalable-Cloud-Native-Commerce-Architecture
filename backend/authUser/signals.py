from django.db.models.signals import post_save
from django.dispatch import receiver
from nextCart.models import Order
from authUser.sendmessaging import send_notification

@receiver(post_save, sender=Order)
def order_status_notification(sender, instance, created, **kwargs):

    if not created:
        send_notification(
            user=instance.user,
            title="Order Update",
            body=f"Your order status is now {instance.status}"
        )
