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

final.write_gif(finalPath, fps=12)


# vc = cv2.VideoCapture(videoPath)

# rval, frame = vc.read()
# cv2.imwrite(framePath, frame)
# cv2.waitKey(1)

# vc.release()

# frameImg = Image.open(framePath)

# width = frameImg.size[0]
# height = frameImg.size[1]

# frameImg = frameImg.crop(((width / 2) - (height / 2), 0, (width / 2) + (height / 2), height))
# frameImg = frameImg.resize((thumbnailSize,thumbnailSize))
# frameImg = frameImg.filter(ImageFilter.GaussianBlur(blurSize))

# logoImg = Image.open(logoPath)
# logoImg = logoImg.resize((thumbnailSize, thumbnailSize))

# frameImg.paste(logoImg, (0,0), logoImg)
# frameImg.save(finalPath)

# os.remove(framePath)

print(finalPath)