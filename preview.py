from PIL import Image, ImageSequence, ImageFilter
import cv2
import os, sys, time, shutil
from moviepy.editor import *

videoPath = sys.argv[1]
logoPath = sys.argv[2]

framePath = '.\\temp\\frame.jpg'
thumbnailPath = '.\\thumbnails\\'
finalPath =  thumbnailPath + time.strftime(f"%Y%m%d-%H%M%S") + '.gif'
blurSize = 3
thumbnailSize = 200

shutil.rmtree(thumbnailPath)
os.mkdir(thumbnailPath)

videoclip = VideoFileClip(videoPath)
videoclip = videoclip.resize(height=200)

x1 = (videoclip.w / 2) - (200 / 2)
x2 = (videoclip.w / 2) + (200 / 2)

videoclip = videoclip.crop(x1, 0, x2, 200)
videoclip = videoclip.set_duration(1)

logo = ImageClip(logoPath).set_duration(1)
logo = logo.resize((200, 200))

final = CompositeVideoClip([videoclip, logo])

final.write_gif(finalPath, fps=5)

print(finalPath)