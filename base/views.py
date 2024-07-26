from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.utils import IntegrityError
from django.core.mail import send_mail
from django.conf import settings
from random import randint
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from base.models import APIkey, Transaction
from django.apps import AppConfig
from django.db.models.signals import pre_save
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import stripe
import uuid
import stripe
import os
import json
import time
@ensure_csrf_cookie
def index(request):
    anon = request.user.is_anonymous
    return render(request, "index.html", {'anonymous':anon})

@csrf_exempt
def sub(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY_TEST
    if request.method == "POST":
        checkout_session = stripe.checkout.Session.create(
			payment_method_types = ['card'],
			line_items = [
				{
					'price': 'price_1PgjcnRu4mKtTRNvukRxKtSI',
					'quantity': 1,
				},
			],
			mode = 'payment',
			customer_creation = 'always',
			success_url = 'http://facecaptcha.me/payment_successful?session_id={CHECKOUT_SESSION_ID}',
			cancel_url = 'http://facecaptcha.me/payment_canceled',
		)
        return redirect(checkout_session.url, code=303)
    return render(request, "subscriptions.html")


## use Stripe dummy card: 4242 4242 4242 4242
def payment_successful(request):
	stripe.api_key = settings.STRIPE_SECRET_KEY_TEST
	checkout_session_id = request.GET.get('session_id', None)
	session = stripe.checkout.Session.retrieve(checkout_session_id)
	customer = stripe.Customer.retrieve(session.customer)
	user_id = request.user.user_id
	return render(request, 'payment_successful.html', {'customer': customer})


def payment_canceled(request):
	stripe.api_key = settings.STRIPE_SECRET_KEY_TEST
	return render(request, 'payment_canceled.html')


@csrf_exempt
def stripe_webhook(request):
	stripe.api_key = settings.STRIPE_SECRET_KEY_TEST
	time.sleep(10)
	payload = request.body
	signature_header = request.META['HTTP_STRIPE_SIGNATURE']
	event = None
	try:
		event = stripe.Webhook.construct_event(
			payload, signature_header, settings.STRIPE_WEBHOOK_SECRET_TEST
		)
	except ValueError as e:
		return HttpResponse(status=400)
	except stripe.error.SignatureVerificationError as e:
		return HttpResponse(status=400)
	if event['type'] == 'checkout.session.completed':
		session = event['data']['object']
		session_id = session.get('id', None)
		time.sleep(15)
	return HttpResponse(status=200)

def gpay(request):
    try:
        if(User.objects.get(username = request.user.username)):
            plan = request.GET.get('plan')
            return render(request, "gpay.html", {'plan': plan})
        else:
            print(1)
            return redirect(profile)
    except:
        print(2)
        return redirect(profile)

def profile(request):
    user = APIkey.objects.get(username = request.user.username)
    real_user = User.objects.get(username = request.user.username)
    transactions = Transaction.objects.filter(username = request.user.username)
    if request.method == "POST":
        print(request.body)
        data = json.loads(request.body)
        print(data['type'])
        if data['type'] == "exit":
            logout(request)
            return JsonResponse()
        elif data['type'] == "delete":
            user.delete()
            real_user.delete()
            transactions.delete()
            return JsonResponse()
        elif data['type'] == "buy":
            plan = data['plan']
            trans = 100
            if plan == 'basic':
                trans = 5000
            elif plan == 'advanced':
                trans = 20000
            user.transactions_left = trans
            user.save()
    results = ''
    dates = ''
    total = 0
    for transaction in transactions:
        results += json.dumps(transaction.result) + '|'
        dates += str(transaction.date) + '|'
        total += 1
    return render(request, "profile.html", {'apikey':user.apikey, 'username':request.user.username, 'plan':user.plan, 'expiration': user.expiration_date, 'results': results, 'dates': dates, 'transactions': transactions, 'total': total, 'expired': user.expired})
#ЭТОТ ВЬЮ ЧТО ТЕБЕ НУЖНО ЖАСБАС ^^^^^^^^^^^^^^^^^^
def starter(request):
    if request.method == "POST" and request.POST.get('email') and len(request.POST.get('password')) >= 8:
        a = 0
        for i in User.objects.all():
            if i.username == request.POST.get('email'):
                a = 1
                user = authenticate(username=request.POST.get('email'), password=request.POST.get('password'))
                if user is not None:
                    login(request, user)
                    return redirect(index)
                else:
                    return render(request, "starter.html", {'msg':"Incorrect password"})
        if request.POST.get('password') == request.POST.get('apassword') and a == 0:
            request.session['email'] = request.POST.get('email')
            request.session['password'] = request.POST.get('password')
            request.session['maysendcode'] = 1
            return redirect(mailverification)
        else:
            return render(request, "starter.html", {'msg':'Your passwords are not matching'})
    elif request.POST.get('email') and len(request.POST.get('password')) < 8:
        return render(request, "starter.html", {'msg':"Your password is too short"})
    return render(request,'starter.html',{'msg':''})

def mailverification(request):
    if request.session['maysendcode'] == 1:
        code = randint(100000,999999)
        send_mail('FaceCaptcha API Email Verification', 'Your verification code is ' + str(code) + "\n Please do not share your code. If you have not created account in FaceCaptcha API, please ignore this email.", 'settings.EMAIL_HOST_USER', [request.session['email']], fail_silently = False)
        request.session['maysendcode'] = 0
        return render(request, 'verify.html', {'code':code})
    if request.method == 'POST':
        userapi = APIkey(username = request.session['email'], apikey = os.urandom(32).hex(), plan = 'starter')
        userapi.save()
        user = User.objects.create_user(username = request.session['email'],password = request.session['password'])
        user.save()
        print(user, userapi)
        login(request, user)
        return JsonResponse({'r':'1'}, safe=False)
    return render(request, 'verify.html')
