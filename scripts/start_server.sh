#!/bin/bash
cd /home/ubuntu/shopplus

# ১. পুরোনো কন্টেইনার বন্ধ করা
docker-compose down

# ২. নতুন ইমেজ বিল্ড করা (Frontend এবং Backend উভয়ের জন্য)
docker-compose build --pull

# ৩. ব্যাকগ্রাউন্ডে সব সার্ভিস (Nginx, Django, Next.js) চালু করা
docker-compose up -d

# ৪. ডাটাবেস মাইগ্রেশন এবং স্ট্যাটিক ফাইল হ্যান্ডলিং (Backend কন্টেইনারের ভেতর)
docker-compose exec -T backend python manage.py migrate --noinput

# ৫. ডকারের অব্যবহৃত ইমেজ ডিলিট করা (সার্ভারের জায়গা বাঁচানোর জন্য)
docker image prune -f