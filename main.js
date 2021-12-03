const $ =  document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const progress = $('#progress');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const PLAYER_STORAGE_KEY = 'Status';

app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    songs: [
        {
          name: "Chơi đồ",
          singer: "MCK-Wxrdie-SonyTran",
          path: "./assets/music/song1.mp3",
          image: "./assets/img/song1.png"
        },
        {
          name: "Độ tộc 2",
          singer: "Độ Mixi-Pháo-Phúc Du-Masew",
          path: "./assets/music/song2.mp3",
          image: "./assets/img/song2.png"
        },
        {
          name: "Phi hành gia",
          singer: "Renja-SlowT-Liwuyn-Kain-Sugar-Cane",
          path: "./assets/music/song3.mp3",
          image: "./assets/img/song3.png"
        },
        {
          name: "Reality",
          singer: "LostFrequencies-JanieckDevy",
          path: "./assets/music/song4.mp3",
          image: "./assets/img/song4.png"
        },
        {
          name: "Tay to",
          singer: "Papital-MCK-Phongkhin",
          path: "./assets/music/song5.mp3",
          image: "./assets/img/song5.png"
        },
        {
          name: "Thủ đô",
          singer: "Cypher-RPT-Orijin",
          path: "./assets/music/song6.mp3",
          image: "./assets/img/song6.png"
        },
        {
          name: "Xích thêm chút Remix",
          singer: "Rapital-MCK-Tlinh",
          path: "./assets/music/song7.mp3",
          image: "./assets/img/song7.png"
        },
        {
            name: "Tay to",
            singer: "Papital-MCK-Phongkhin",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.png"
        },
        {
            name: "Thủ đô",
            singer: "Cypher-RPT-Orijin",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.png"
        },
        {
            name: "Xích thêm chút Remix",
            singer: "Rapital-MCK-Tlinh",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.png"
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
          return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
        });
        playlist.innerHTML = htmls.join("");
        console.log(playlist)
        
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: 'center'
            })
        },200)
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdAnimate = cdThumb.animate(
            [{transform: 'rotate(360deg'}],
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdAnimate.pause();
        
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause();
            }else {
                audio.play();
            }
        }

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdAnimate.play();
        }

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdAnimate.pause();
        }

        audio.ontimeupdate = function () {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            if(audio.duration) {
                progress.value = progressPercent;
            }
        }

        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play();
            }else {
                nextBtn.click();
            }
        }

        progress.oninput = function(e) {
            const seekTime = Math.floor(audio.duration / 100 * e.target.value);
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        playlist.onclick = function(e) {    
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render()
                    audio.play();
                }

                if(e.target.closest('.option')) {

                }
            }
        }
    },
    start: function () {
        this.loadConfig();
        
        this.defineProperties();
        
        this.loadCurrentSong();
        
        this.handleEvents();
        
        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();
