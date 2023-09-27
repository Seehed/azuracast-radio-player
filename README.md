
![Screenshot_6](https://github.com/Seehed/azuracast-radio-player/assets/55226001/9f643cb1-c977-4f3b-96d1-34eaad2bf423)

# azuracast-radio-player
This is a basic Radio station player for Azuracast
This is made by TypicalSounds, this is a basic player only.. It displays current album art, current song playing, next song playing, previous song playing, and a optional request feature. This package does not include any others like Audio ad injection, local idents, etc based on location. That is advanced and only TypicalStreamBiz plans get access to it.
STEPS TO MAKE IT WORK: DOWNLOAD THIS TO A DIRECTORY THAT A WEB SERVER IS LINKED TO. 


1. Go into rename_me.html, under line 10 is the SEO (Search Engine Optimization), here you will put a title description, and picture for your player, so when you send the link to people, there will be text and a picture. 

Then go to line 26 or find "audio src", then enter the URL of ur radio, it works on AAC, hls, MP3, and FLAC streams.. 

You can delete line 52 or <div class="request-song">
          <a href="#" id="request-link" target="_blank">Request Song</a> <!-- Added target="_blank" to open in a new tab -->
        </div> If you do not have a request system

Line 70 or social-icons is where you add your social media icons and links, href is the actual link it will take you to once u click it, and src is where the image for the link is found, I have some pre-made ones in static-ico, so you would put down static-ico/file.png, or you can add whatever .ico, .png, .jpg link. 

Finally, you add your copyright handle at the bottom. 

2. Go into player.js, on line 25 replace the placeholder with your azuracast station API URL, an example would be http://azuracast.com/api/1, the number at the end should be replaced with the station id that Azuracast assigned to you. You can delete lines 32 - 53 if you do not have a request function.

3. in the CSS file, if you do not have a request system, then delete .request-song & .message-box. 

