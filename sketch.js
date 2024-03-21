// variables
let world;
let container;
let cabinet;

//background music
let bgm;
let playBgm = 0;

// secretary models
let secretary, drawer;
let drawerContainer;
let clickRegion1;

//drawers
let drawerTop;
let drawerLeft;
let drawerRight;

var animationMode = false;

function preload(){
	bgm = loadSound('audio/intro.mp3');
}

function setup() {
    	let cnv =createCanvas(512,512).id();

    	// construct the A-Frame world
    	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    	world = new World('VRScene');
        // turn off WASD
    	world.camera.cameraEl.removeAttribute('wasd-controls')

    	let floor = new Plane({
    		x:0,y:0,z:-20,
    		asset:'bgr2',
    		width:800, height:600,
            scaleX: 0.08,
            scaleY: 0.08
    	});
    	world.add(floor);

        container = new Container3D({
            x: -3.5,
            y: -8.4,
            z:-6.5,
            scaleX:3,
            scaleY:3,
            scaleZ:3
        });
        world.add(container)

        // add a Wavefront (OBJ) model
        // you need to make sure to reference both the OBJ and MTL file here (geometry & material are stored separately)
        secretary = new OBJ({
            asset: 'robot_obj',
            mtl: 'robot_mtl',
            x: 0,
            y: 0,
            z: 0,
            rotationX:0,
            scaleX:0.03,
            scaleY:0.03,
            scaleZ:0.03,
        });
        container.add(secretary);

	    const rotateLeftBtn = new Tetrahedron({
            x: -4,
            y: 0,
            z: 0,
            radius: 0.5,
            red: 207,
            green: 185,
            blue: 151,
            enterFunction: function (me) {
                me.setScale(1.5, 1.5, 1.5);
            },
            leaveFunction: function (me) {
                me.setScale(1, 1, 1);
            },
            clickFunction: (me) => {
                if(container.rotationY < 50){
                	container.spinY(8);
                }
            },
        });

        const rotateRightBtn = new Tetrahedron({
            x: 4,
            y: 0,
            z: 0,
            radius: 0.5,
            red: 207,
            green: 185,
            blue: 151,
            enterFunction: function (me) {
                me.setScale(1.5, 1.5, 1.5);
            },
            leaveFunction: function (me) {
                me.setScale(1, 1, 1);
            },
            clickFunction: (me) => {
                if(container.rotationY > -8){
                	container.spinY(-5);
                }
            },
        });

        world.add(rotateLeftBtn)
        world.add(rotateRightBtn)

        clickRegion1 = new Box({
            // x: 1.05, y: 1.5, z: -0.3,
            x: 1.05, y:1.5, z: -0.3,
            red: 255, green: 255, blue: 0,
            width: 0.5, height: 0.5, depth: 0.5,
            rotationX: -35,
            opacity: 0.2,
            clickFunction: function(e) {
                animationMode = true;
                world.remove(e);
            }
        });
        container.add(clickRegion1);

        drawer = new OBJ({
            asset: 'drawer_obj',
            mtl: 'drawer_mtl',
            x: 0,
            y: 0,
            z: 0,
            scaleX:0.03,
            scaleY:0.03,
            scaleZ:0.03,
        });

        drawerContainer = new Container3D({
            //0.9, 1.1, -0.3
            x: 0.9,
            y: 1.1,
            z: -0.3,
            rotationX:-35
        })
        container.add(drawerContainer);
        drawerContainer.add(drawer);

        drawerTop = new Box({
            red: 0, blue: 255, green: 0,
            //-0.2 0.45 1.4
            x: -0.2, y: 0.45, z: 1.4,
            width: 0.3, height: 0.05, depth: 0.5,
            opacity: 0,
            clickFunction: function(e) {
                e.clicked = true;
            }
        });
        drawerTop.movementDirection = 0.01;
        drawerTop.clicked = false;
        drawerContainer.add(drawerTop);

        drawerLeft = new Box({
            red: 0, blue: 0, green: 255,
            //-0.35 0.3 1.4
            x: -0.35, y: 0.3, z: 1.4,
            rotationZ: 90,
            width: 0.4, height: 0.05, depth: 0.5,
            opacity: 0,
            clickFunction: function(e) {
                e.clicked = true;
            }
        });

        drawerLeft.movementDirection = 0.01;
        drawerLeft.clicked = false;
        drawerContainer.add(drawerLeft);

        drawerRight = new Box({
            red: 255, blue: 0, green: 0,
            //-0.1 0.3 1.4
            x: -0.1, y: 0.3, z: 1.4,
            rotationZ: 90,
            width: 0.4, height: 0.05, depth: 0.5,
            opacity: 0,
            clickFunction: function(e) {
                e.clicked = true;
            }
        });
        drawerRight.movementDirection = 0.01;
        drawerRight.clicked = false;
        drawerContainer.add(drawerRight);


        // an ambient light - this light has no position and lights all entities equally
        light2 = new Light({
            color: '#fff',
            type: 'ambient',
            intensity: 0.9,
            x:0,
            y:0,
            z:0
        })
        container.add(light2)

}

function switchBgm(e) {
    e.target.children.forEach((c) => c.classList.toggle('hidden'));
    if (!bgm || !bgm.isLoaded()) {
        console.log('bgm not ready');
    } else {
        playBgm ? bgm.pause() : bgm.play();
        playBgm ^= 1;
    }
}

function draw() {
    if (animationMode) {
        popOutDrawer();
        // popInDrawer();
    }

    //move the small counterpart
    if (drawerTop.clicked) {
        drawerTop.nudge(0,0,drawerTop.movementDirection);
        if (drawerTop.movementDirection > 0 && drawerTop.getZ() > 1.9) {
            drawerTop.clicked = false;
            drawerTop.movementDirection = -0.01;
        }
        else if (drawerTop.movementDirection < 0 && drawerTop.getZ() <= 1.4) {
            drawerTop.clicked = false;
            drawerTop.movementDirection = 0.01;
        }
    }
    if (drawerLeft.clicked) {
        drawerLeft.nudge(0,0,drawerLeft.movementDirection);
        if (drawerLeft.movementDirection > 0 && drawerLeft.getZ() > 1.9) {
            drawerLeft.clicked = false;
            drawerLeft.movementDirection = -0.01;
        }
        else if (drawerLeft.movementDirection < 0 && drawerLeft.getZ() <= 1.4) {
            drawerLeft.clicked = false;
            drawerLeft.movementDirection = 0.01;
        }
    }

    if (drawerRight.clicked) {
        drawerRight.nudge(0,0,drawerRight.movementDirection);
        if (drawerRight.movementDirection > 0 && drawerRight.getZ() > 1.9) {
            drawerRight.clicked = false;
            drawerRight.movementDirection = -0.01;
        }
        else if (drawerRight.movementDirection < 0 && drawerRight.getZ() <= 1.4) {
            drawerRight.clicked = false;
            drawerRight.movementDirection = 0.01;
        }
    }
}

let drawerPopOutCounter = 0;
function popOutDrawer() {

    if (drawerPopOutCounter < 100) {
        drawer.nudge(0,0,0.01);
        drawerPopOutCounter++;
    }
    else if (drawerPopOutCounter < 135) {
        drawerContainer.spinX(1);
        drawerPopOutCounter++;
    }
    else if (drawerPopOutCounter < 135+180) {
        drawer.spinY(1);
        drawerPopOutCounter++;
    }
    else {
        drawerTop.setOpacity(1.0);
        drawerLeft.setOpacity(1.0);
        drawerRight.setOpacity(1.0);
        animationMode = false;
    }
}
function popInDrawer() {
    if (drawerPopOutCounter >= 135) {
        drawer.spinY(-1);
        drawerPopOutCounter--;
    }
    else if (drawerPopOutCounter >= 100) {
        drawerContainer.spinX(-1);
        drawerPopOutCounter--;
    }

    else if (drawerPopOutCounter >= 0) {
        drawer.nudge(0,0,-0.01);
        drawerPopOutCounter--;
    }
}
