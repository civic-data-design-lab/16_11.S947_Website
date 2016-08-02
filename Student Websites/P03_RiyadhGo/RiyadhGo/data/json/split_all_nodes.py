import json

def byteify(input):
    if isinstance(input, dict):
        return {byteify(key):byteify(value) for key,value in input.iteritems()}
    elif isinstance(input, list):
        return [byteify(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input

with open("all_nodes_.json") as data_file:
    data = byteify(json.load(data_file))

    for datapiece in data:
        print datapiece

        dirname = "splited/"+datapiece+".json"

        with open(dirname, 'w') as fp:
            json.dump(data[datapiece], fp)






'''
for date in datelst:

    dataByDate = data[date]

    dir = "weather_data/airports/"

    with open(dir+date+'.json', 'w') as fp:
        json.dump(dataByDate, fp)'''