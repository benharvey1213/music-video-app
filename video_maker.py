from moviepy.editor import *
from skimage.filters import gaussian
import sys, time

desired_width = 1000
desired_duration = 5

video_path = sys.argv[1]
audio_path = sys.argv[2]
logo_path = sys.argv[3]
export_path = sys.argv[4]

full_path = export_path + '\\' + time.strftime("%Y%m%d-%H%M%S") + '.mp4'

def blur(image):
    return gaussian(image.astype(float), sigma=5)

videoclip = VideoFileClip(video_path)
videoclip = videoclip.resize(height=desired_width)

x1 = (videoclip.w / 2) - (desired_width / 2)
x2 = (videoclip.w / 2) + (desired_width / 2)

videoclip = videoclip.crop(x1, 0, x2, desired_width)
videoclip = videoclip.fl_image(blur)
videoclip = videoclip.loop(duration=desired_duration)

audioclip = AudioFileClip(audio_path)
audioclip = audioclip.set_duration(desired_duration)
new_audioclip = CompositeAudioClip([audioclip])
videoclip.audio = new_audioclip

videoclip = videoclip.set_duration(desired_duration)

logo = ImageClip(logo_path).set_duration(desired_duration)
final = CompositeVideoClip([videoclip, logo])

final.write_videofile(full_path)
