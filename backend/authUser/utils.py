
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_activation_email( username , email , otp):

    context = { 'username' : username , 'otp' : otp }

    html_message = render_to_string("activation_email.html", context)

    plain_message =strip_tags(html_message)


    message = EmailMultiAlternatives(
        subject='verification code',
        body=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email]
    )
    

    message.attach_alternative(message , 'text/html' )

    message.send()  

