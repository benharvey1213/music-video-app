from moviepy.editor import *
from skimage.filters import gaussian
import sys, time

desired_height = 1000
desired_duration = 60

video_path = sys.argv[1]
audio_path = sys.argv[2]
logo_path = sys.argv[3]
export_path = sys.argv[4]

# video_path = 'C:\\Users\\benha\\Desktop\\Test\\Videos\\video.mp4'
# audio_path = 'C:\\Users\\benha\\Desktop\\Test\\Beats\\Beat80.wav'
# logo_path = 'C:\\Users\\benha\\Desktop\\Test\\Static\\logo4.png'
# export_path = 'C:\\Users\\benha\\Google Drive\\Beat Videos'

full_path = export_path + '\\' + time.strftime(f"%Y%m%d-%H%M%S") + '.mp4'

def blur(image):
    return gaussian(image.astype(float), sigma=5)

videoclip = VideoFileClip(video_path)
videoclip = videoclip.resize(height=desired_height)

x1 = (videoclip.w / 2) - (desired_height / 2)
x2 = (videoclip.w / 2) + (desired_height / 2)

videoclip = videoclip.crop(x1, 0, x2, desired_height)
videoclip = videoclip.fl_image(blur)
videoclip = videoclip.loop(duration=desired_duration)

audioclip = AudioFileClip(audio_path)
audioclip = audioclip.set_duration(desired_duration)
new_audioclip = CompositeAudioClip([audioclip])
videoclip.audio = new_audioclip

videoclip = videoclip.set_duration(desired_duration)

logo = ImageClip(logo_path).set_duration(desired_duration)
final = CompositeVideoClip([videoclip, logo])

final.write_videofile(full_path, preset='ultrafast', temp_audiofile="temp-audio.m4a", remove_temp=True, codec='libx264', audio_codec="aac")