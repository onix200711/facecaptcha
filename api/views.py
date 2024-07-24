from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import APIkey, Transaction
from datetime import datetime, timezone
import requests
import base64
def liveness():
    url = 'https://kyc.biometric.kz/api/v1/backend/liveness/short/'
    headers = {
        'accept': 'application/json',
    }

    face_path = './image.png'
    files = {
        'image': ('image.png', open(face_path,"rb"), 'image/png'),
    }
    data = {
        'api_key': 'W-EFrw51p8ftC2wAbCvGISnocqI_LR60Qntm3ilkMC2XCic',
    }

    response = requests.post(url, headers=headers, files=files, data=data)

    return response.json()
@api_view(['POST'])
def addItem(request):
    i = request.data
    print(i['apikey'])
    try:
        keyobj = APIkey.objects.get(apikey=i['apikey'])
        if keyobj != None:
            deletion_time = datetime.now(timezone.utc) - keyobj.creation_date
            print(deletion_time)
            if(keyobj.transactions_left > -1 or deletion_time.days <= 30):
                file_content = base64.b64decode(i['image'])
                with open("image.png", "wb") as f:
                    f.write(file_content)
                x = liveness()
                trans = Transaction(username=keyobj.username, result=x)
                trans.save()
                print(x)
                keyobj.transactions_left -= 1
                keyobj.save()
                return Response(x)
            else:
                keyobj.expired = True
                keyobj.save()
                return Response('Your Subscription has expired')
    except:
        print('API key error')
        return Response('Wrong API key')
    #serializer = ItemSerializer(data=request.data)
    #if serializer.is_valid():
    #    serializer.save()