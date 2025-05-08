     function playYouTubeVideo() {
            const iframe = document.getElementById('youtubePlayer');
            iframe.src += "?autoplay=1";
            document.querySelector('.play-button').style.opacity = '0';
            document.querySelector('.play-button').style.transform = 'scale(1.5)';
    }
