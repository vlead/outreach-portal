import requests
import json

url = "http://localhost:5000/nodal_centres"
ncentres = requests.get(url)
total_ncentres =  len(ncentres.json())
nodal_centre_ids = []

for i in range(total_ncentres):
    centre = ncentres.json()[i]
    try:
        id = centre["id"]
        location = str(centre["location"])
        nodal_centre_ids.append({"id": id, "location" : location})
    except Exception, e:
        print "Exception : " + str(e)

total = len(nodal_centre_ids)
google_maps_api = "https://maps.googleapis.com/maps/api/geocode/json"
key = "AIzaSyDWc-KEZdSmdZPUUAbB5utNG_3orG7rXkQ"

for i in nodal_centre_ids:
    address = i['location']+",India,Asia"
    api_url = google_maps_api +"?"+"address="+address+"&key="+key
    geocodes = requests.get(api_url)
    result = geocodes.json()['results']
    #print geocodes.json()
    try:
        lat = result[0]['geometry']['location']['lat']
        lng = result[0]['geometry']['location']['lng']
        i['lat'] = lat
        i['lng'] = lng
        try:
            resp = requests.put(url+"/"+str(i['id']), headers={"email" : "dsfd", "key" : "dfdf"}, data={"longitude" : str(lng), "lattitude" : str(lat)})
            if resp.status_code == 200:
                print "Successfully updated geo_codes for nodal centre == " + i['location']+", India, Asia"
        except Exception, e:
            print "Failed to update geo_codes for nodal centre == " + i['location']+", India, Asia"

    except Exception, e :
        print "Exception:"+str(e)
