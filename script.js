AFRAME.registerComponent('player-control', {
    init: function () {
        this.el.sceneEl.addEventListener('mousemove', this.onMouseMove.bind(this));
    },
    onMouseMove: function (evt) {
        var el = this.el;
        var mouseX = (evt.clientX / window.innerWidth) * 2 - 1;
        el.setAttribute('position', {x: mouseX * 5, y: -4, z: -5});
    }
});

AFRAME.registerComponent('falling-object', {
    init: function () {
        this.el.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.25
        });
        this.el.setAttribute('material', 'color', this.getRandomColor());
    },
    tick: function () {
        var position = this.el.getAttribute('position');
        position.y -= 0.05;
        
        if (position.y < -5) {
            this.el.parentNode.removeChild(this.el);
        } else {
            this.el.setAttribute('position', position);
            this.checkCollision();
        }
    },
    checkCollision: function () {
        var playerEl = document.querySelector('#player');
        var playerPos = playerEl.getAttribute('position');
        var objectPos = this.el.getAttribute('position');
        
        if (Math.abs(playerPos.x - objectPos.x) < 1 && Math.abs(playerPos.y - objectPos.y) < 0.5) {
            this.el.parentNode.removeChild(this.el);
            this.updateScore();
        }
    },
    updateScore: function () {
        var scoreEl = document.querySelector('#score');
        var currentScore = parseInt(scoreEl.getAttribute('value').split(': ')[1]);
        scoreEl.setAttribute('value', 'Score: ' + (currentScore + 1));
    },
    getRandomColor: function () {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
});

AFRAME.registerSystem('game-manager', {
    init: function () {
        this.spawnObject();
    },
    spawnObject: function () {
        var scene = this.el.sceneEl;
        var object = document.createElement('a-entity');
        object.setAttribute('position', {
            x: Math.random() * 10 - 5,
            y: 6,
            z: -5
        });
        object.setAttribute('falling-object', '');
        scene.appendChild(object);
        
        setTimeout(() => this.spawnObject(), 2000);
    }
});