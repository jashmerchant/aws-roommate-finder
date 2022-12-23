import json
import boto3
import numpy as np
import pandas as pd
import io
import os
import sys
from io import StringIO
import logging


logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def lambda_handler(event, context):
    logger.debug("Function called \n")
    logger.debug(event)
    # Get data from the user and preprocess it for appropriate use in the model
    # jsonStrDict = {
    # 'age':22,
    # 'sex': 'f',
    # 'orientation':'straight',
    # 'diet':'anything',
    # 'drinks':'socially',
    # 'drugs':'never',
    # 'ethnicity':'asian,indian',
    # 'income':"100000",
    # 'location':'new york',
    # 'pets':"cats,dogs",
    # 'smokes':'trying to quit',
    # 'speaks':'english, hindi'
    # }
    jsonStrDict = json.loads(event['body'])
    logger.debug('checking jsonStrDict')
    logger.debug(jsonStrDict)
    dfinput = pd.DataFrame(columns=['age', 'sex', 'orientation', 'diet', 'drinks', 'drugs', 'education',
                                    'ethnicity', 'income', 'location', 'pets', 'smokes', 'speaks'])
    dfinput['age'] = jsonStrDict['age']
    dfinput['sex'] = jsonStrDict['sex']
    dfinput['orientation'] = jsonStrDict['orientation']
    dfinput['diet'] = jsonStrDict['diet']
    dfinput['drinks'] = jsonStrDict['drinks']
    dfinput['drugs'] = jsonStrDict['drugs']
    dfinput['ethnicity'] = jsonStrDict['ethnicity']
    dfinput['income'] = jsonStrDict['income']
    dfinput['location'] = jsonStrDict['location']
    dfinput['pets'] = jsonStrDict['pets']
    dfinput['smokes'] = jsonStrDict['smokes']
    dfinput['speaks'] = jsonStrDict['speaks']
    dftry = pd.DataFrame(jsonStrDict, index=[0])
    df = dftry

    # handling speaks column
    df['speaks'] = df['speaks'].str.replace('\(.*?\)', "", regex=True)
    df['speaks'] = df['speaks'].str.replace(" ", "")
    df = pd.concat([df, df['speaks'].str.split(',', expand=True)], axis=1)
    temp = df['speaks'][0]
    n = len(temp.split(','))

    df = pd.get_dummies(df, columns=[i for i in range(n)])
    languages = {'lisp',
                 'hindi', 'ilongo', 'tamil', 'welsh', 'latin', 'icelandic', 'indonesian',
                 'belarusan', 'chechen', 'arabic', 'signlanguage', 'mongolian',
                 'russian', 'catalan', 'dutch', 'serbian', 'italian', 'ancientgreek',
                 'norwegian', 'bengali', 'portuguese', 'croatian', 'hawaiian', 'swahili',
                 'korean', 'afrikaans', 'slovak', 'greek', 'persian', 'thai', 'occitan',
                 'hebrew', 'armenian', 'tibetan', 'czech', 'c++', 'finnish', 'romanian',
                 'urdu', 'gujarati', 'swedish', 'malay', 'maori', 'basque', 'hungarian',
                 'polish', 'bulgarian', 'english', 'breton', 'cebuano', 'tagalog',
                 'other', 'vietnamese', 'slovenian', 'lithuanian', 'french', 'danish',
                 'farsi', 'sardinian', 'esperanto', 'turkish', 'rotuman', 'estonian',
                 'khmer', 'german', 'ukrainian', 'georgian', 'yiddish', 'japanese',
                 'latvian', 'sanskrit', 'irish', 'spanish', 'frisian', 'chinese',
                 'albanian'}

    for lang in languages:
        df[lang] = 0
        col_list = list()
        for i in range(n):
            col_name = str(i) + "_" + lang
            if col_name in df.columns:
                col_list.append(col_name)
        df[lang] = df[col_list].sum(axis=1)
        df = df.drop(labels=col_list, axis=1)

    df = df.drop(labels='speaks', axis=1)
    df['cats'] = df['pets'].str.contains('cats').astype(int)
    df['dogs'] = df['pets'].str.contains('dogs').astype(int)
    df = df.drop(labels='pets', axis=1)
    df['location'] = df['location'].str.split(",").str[-1]
    locations = {'california', 'colorado', 'new york', 'oregon', 'arizona',
                 'hawaii', 'montana', 'spain', 'nevada', 'illinois', 'vietnam',
                 'ireland', 'louisiana', 'michigan', 'texas', 'united kingdom',
                 'massachusetts', 'north carolina', 'idaho', 'mississippi',
                 'new jersey', 'florida', 'minnesota', 'georgia', 'utah',
                 'washington', 'west virginia', 'connecticut', 'tennessee',
                 'rhode island', 'districtofcolumbia', 'canada', 'missouri',
                 'germany', 'pennsylvania', 'netherlands', 'switzerland', 'ohio'}
    for loc in locations:
        df['location_'+loc.replace(" ", "").strip()
           ] = df['location'].str.contains(loc).astype(int)
    df = df.drop(labels='location', axis=1)
    df['income'] = df['income'].replace(-1, 0)
    df['ethnicity'] = df['ethnicity'].str.replace(" ", "")
    df = pd.concat([df, df['ethnicity'].str.split(',', expand=True)], axis=1)
    temp = df['ethnicity'][0]
    n = len(temp.split(','))
    df = pd.get_dummies(df, columns=[i for i in range(n)])
    ethnicities = {'asian', 'white', 'black', 'hispanic/latin', 'indian',
                   'pacificislander', 'middleeastern', 'nativeamerican'
                   }
    for eth in ethnicities:
        df[eth] = 0
        col_list = list()
        for i in range(n):
            col_name = str(i) + "_" + eth
            if col_name in df.columns:
                col_list.append(col_name)
        df[eth] = df[col_list].sum(axis=1)
        df = df.drop(labels=col_list, axis=1)
    df = df.drop(labels=["ethnicity"], axis=1)
    status = {'sometimes', 'no', 'when drinking', 'yes', 'trying to quit'}
    for s in status:
        df[s] = df['smokes'].str.contains(s).astype(int)
    df[['smokes', 'sometimes', 'no', 'when drinking',
        'yes', 'trying to quit']].head(5)
    df = df.drop(labels='smokes', axis=1)
    sex_list = ['f', 'm']
    for sex in sex_list:
        df['sex_'+sex] = df['sex'].str.contains(sex).astype(int)
    df = df.drop(labels='sex', axis=1)
    orientation = {'straight', 'bisexual', 'gay'}
    for o in orientation:
        df['orientation_'+o] = df['orientation'].str.contains(o).astype(int)
    df = df.drop(labels='orientation', axis=1)
    diet = {'anything', 'other', 'vegetarian', 'vegan', 'halal', 'kosher'}
    for d in diet:
        df['diet_'+d] = df['diet'].str.contains(d).astype(int)
    df = df.drop(labels='diet', axis=1)
    drinks = {'socially', 'often', 'not at all',
              'rarely', 'very often', 'desperately'}
    for d in drinks:
        df['drinks_'+d] = df['drinks'].str.contains(d).astype(int)
    df = df.drop(labels='drinks', axis=1)
    drugs = {'never', 'often', 'sometimes'}
    for d in drugs:
        df['drugs_'+d] = df['drugs'].str.contains(d).astype(int)
    df = df.drop(labels='drugs', axis=1)
    df.count(axis='columns')
    col_lst = []
    for i in df.columns:
        col_lst.append(i)
    original_columns = ['age', 'income', 'maori', 'swahili', 'ancientgreek', 'finnish', 'welsh', 'hungarian', 'korean', 'bengali', 'ilongo', 'c++', 'gujarati', 'latin', 'chinese', 'serbian', 'afrikaans', 'tibetan', 'dutch', 'indonesian', 'estonian', 'spanish', 'thai', 'italian', 'romanian', 'hindi', 'norwegian', 'albanian', 'hawaiian', 'swedish', 'sardinian', 'japanese', 'georgian', 'mongolian', 'tagalog', 'turkish', 'lithuanian', 'rotuman', 'danish', 'occitan', 'czech', 'armenian', 'other', 'esperanto', 'vietnamese', 'catalan', 'hebrew', 'latvian', 'bulgarian', 'cebuano', 'slovenian', 'malay', 'french', 'ukrainian', 'russian', 'portuguese', 'persian', 'german', 'basque', 'greek', 'tamil', 'urdu', 'english', 'belarusan', 'frisian', 'irish', 'chechen', 'lisp', 'croatian', 'yiddish', 'icelandic', 'farsi', 'sanskrit', 'breton', 'slovak', 'polish', 'arabic', 'khmer', 'signlanguage', 'sometimes', 'yes', 'when drinking', 'no', 'trying to quit', 'indian', 'black', 'asian', 'pacificislander', 'nativeamerican', 'hispanic/latin', 'white', 'middleeastern', 'cats', 'dogs', 'sex_f', 'sex_m', 'orientation_bisexual',
                        'orientation_gay', 'orientation_straight', 'diet_anything', 'diet_halal', 'diet_kosher', 'diet_other', 'diet_vegan', 'diet_vegetarian', 'drinks_desperately', 'drinks_not at all', 'drinks_often', 'drinks_rarely', 'drinks_socially', 'drinks_very often', 'drugs_never', 'drugs_often', 'drugs_sometimes', 'location_arizona', 'location_california', 'location_canada', 'location_colorado', 'location_connecticut', 'location_districtofcolumbia', 'location_florida', 'location_georgia', 'location_germany', 'location_hawaii', 'location_idaho', 'location_illinois', 'location_ireland', 'location_louisiana', 'location_massachusetts', 'location_michigan', 'location_minnesota', 'location_mississippi', 'location_missouri', 'location_montana', 'location_netherlands', 'location_nevada', 'location_newjersey', 'location_newyork', 'location_northcarolina', 'location_ohio', 'location_oregon', 'location_pennsylvania', 'location_rhodeisland', 'location_spain', 'location_switzerland', 'location_tennessee', 'location_texas', 'location_unitedkingdom', 'location_utah', 'location_vietnam', 'location_washington', 'location_westvirginia']
    # Read the data from s3 file
    ENDPOINT_NAME = os.environ['endpoint']
    runtime = boto3.client('runtime.sagemaker')

    s3 = boto3.client('s3')
    bucket = 'roommaterecommendationsdata'
    file_name = 'predictions.csv'
    s3_object = s3.get_object(Bucket=bucket, Key=file_name)
    body = s3_object['Body'].read().decode("utf-8").split('\n')
    income = list()
    age = list()
    df_for_prediction = pd.DataFrame(columns=original_columns)
    for column in original_columns:
        df_for_prediction[column] = df[column]
    #  for row in body[1::]:
    #     df_for_data = pd.read_csv(StringIO(row))
    #     print(df_for_data)
    #     break
    #     cols = row.split(",")
    #     print(cols)
    #     break
    #     income.append(cols[7])
    #     age.append(cols[0])
    # # Get min and max of the income's column
    # print(income)
    # print(age)
    # min_income = np.min(income)
    # max_income = np.max(income)
    # min_age = np.min(age)
    # max_age = np.max(age)
    # normalize the value of df['income'] based on min and max
    df_for_prediction['age'] = (
        np.abs(int(df_for_prediction['age'])-18))/(69-18)
    df_for_prediction['income'] = (
        np.abs(int(df_for_prediction['income'])-0))/(1000000-0)
    # convert the df to numpy array
    df_new = df_for_prediction.astype('float32')
    df_new = df_new.to_numpy()
    csv_data = df_for_prediction.to_csv(index=False, header=False)
    response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                       Body=csv_data,
                                       ContentType='text/csv')
    result = json.loads(response['Body'].read().decode('utf-8'))
    cluster_prediction = int(result['predictions'][0]['closest_cluster'])
    recommendations = list()
    for row in body[1::]:
        cols = row.split(",")
        if cols[len(cols)-1] != '' and int(float(cols[len(cols)-1])) == cluster_prediction:
            # TODO: Append the username
            recommendations.append(cols[len(cols)-2])

    # Query Dynamo DB
    usernames = recommendations[:10:]
    logger.debug("Recommendations")
    logger.debug(usernames)
    dynamodb = boto3.client('dynamodb')
    response = dynamodb.batch_get_item(
        RequestItems={
            'users': {
                'Keys': [
                    {'username': {'S': username}} for username in usernames
                ]
            }
        }
    )

    items = response['Responses']['users']
    logger.debug("Items returned from database are\n")
    logger.debug(items)
    recommendationsList = list()
    for item in items:
        jsonData = item
        newjsonData = dict()
        for key in jsonData:
            logger.debug("Error in the key is")
            logger.debug(key)
            if key == "friendlist":
                if 'S' in jsonData[key]:
                    newjsonData[key] = list()
                else:
                    friendsListList = []
                    for friends in jsonData[key]['L']:
                        friendsListJson = dict()
                        jsonF = friends['M']
                        if "username" in jsonF:
                            friendsListJson["username"] = jsonF["username"]["S"]
                        if "name" in jsonF:
                            friendsListJson["name"] = jsonF["name"]["S"]
                        if "request" in jsonF:
                            friendsListJson["request"] = jsonF["request"]["S"]
                        if "status" in jsonF:
                            friendsListJson["status"] = jsonF["status"]["S"]
                        friendsListList.append(friendsListJson)
                    newjsonData[key] = friendsListList
            else:
                newjsonData[key] = jsonData[key]['S']
        recommendationsList.append(newjsonData)
    print(recommendationsList)
    # for item in items:
    #     print(item)
    # usernames = recommendations[:10:]
    # logger.debug("Recommendations")
    # logger.debug(usernames)
    # dynamodb = boto3.client('dynamodb')
    # response = dynamodb.batch_get_item(
    # RequestItems={
    #     'users': {
    #         'Keys': [
    #             {'username': username } for username in usernames
    #         ]
    #     }
    # }
    # )

    # items = response['Responses']['users']

    # resultlist = [{k: v["S"]} for item in items for k, v in item.items()]

    # Call sagemaker endpoint for getting prediction
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "test": "test"
        },
        "body": json.dumps({
            "message": "Success",
            "recommendations": recommendationsList
        })
    }
