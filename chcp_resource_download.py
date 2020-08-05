#coding: utf-8
from urllib import request
import json
import os

def getFiles():
    baseURL = 'http://chcp-gcox.chainteam.cc' #资源文件所在服务器域名
    manifest='chcp.manifest' #配置文件
    folderPath = os.path.split(os.path.realpath(__file__))[0]
    folderPath = os.path.join(folderPath, 'www')
    res = request.urlopen('%s/%s'%(baseURL,manifest)).read().decode('utf8')  # 1 读取数据串
    res = json.loads(res) #转换为数组
    res.append({'file':'chcp.json'})
    res.append({'file':'chcp.manifest'})
    for item in res:
        file = item['file']
        fileURL = '%s/%s'%(baseURL, file)
        filepath = os.path.join(folderPath, file.replace('/','\\'))
        #判断文件夹是否存在，没有则创建
        if not os.path.exists(os.path.dirname(filepath )):
            os.makedirs(os.path.dirname(filepath ))
        #判断文件是否已存在，没有则下载
        print('Try downloading file: %s\n'%fileURL)
        request.urlretrieve(fileURL, filename=filepath)
    print('===================== Finished download chcp resource ====================')

getFiles()