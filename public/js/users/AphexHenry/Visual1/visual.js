
function Visual() {

}

Visual.prototype.Setup = function()
{
        this.geometry = new THREE.Geometry();
    this.geometry2 = new THREE.Geometry();

    this.n = 1000;
    this.n2 = 2 * this.n;
    this.ribbons = [];

    var h;
    var i2, x, y, z;
    var color;

    for (var i = -this.n; i < this.n; i++ ) {

        i2 = i + this.n;

        x = i * 1.175;
        y = ( i2 % 2 ) * 5;

        if ( i2 % 2 )  {

            z = 10 * Math.sin( i2 * 0.3 ) * Math.cos( i2 * 0.1 );

        }

        this.geometry.vertices.push( new THREE.Vector3( x, y, z ) );
        this.geometry2.vertices.push( new THREE.Vector3( x, y, z ) );

        h = i2 % 2 ? 1 : 0.15;
        if( i2 % 4 <= 2 ) h -= 0.15;

        color = new THREE.Color( 0xffffff );
        color.setHSV( 0.1 , 0, h );
        this.geometry.colors.push( color );
        this.geometry2.colors.push( color );
    }

    var tmpRot = new THREE.Matrix4();
    tmpRot.makeRotationAxis( new THREE.Vector3( 1, 0, 0 ), Math.PI/2 );

    var xgrid = 34;
    var ygrid = 15;
    this.nribbons = xgrid * ygrid;
    var ribbon;

    c = 0;
    this.materials = [];
    for ( i = 0; i < xgrid; i ++ )
    for ( j = 0; j < ygrid; j ++ ) {

        this.materials[ c ] = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: true } );

        ribbon = new THREE.Ribbon( i % 2 ? this.geometry : this.geometry2, this.materials[ c ] );
        ribbon.rotation.x = 0;
        ribbon.rotation.y = Math.PI / 2;
        ribbon.rotation.z = Math.PI;

        x = 40 * ( i - xgrid/2 );
        y = 40 * ( j - ygrid/2 );
        z = 0;
        ribbon.position.set( x, y, z );

        this.materials[c].color.setHSV( i / xgrid, 0.3 +  0.7 * j / ygrid, 1 );

        ribbon.doubleSided = true;
        ribbon.matrixAutoUpdate = false;

        // manually create local matrix

        ribbon.matrix.setPosition( ribbon.position );
        ribbon.matrixRotationWorld.setRotationFromEuler( ribbon.rotation );

        ribbon.matrix.elements[ 0 ] = ribbon.matrixRotationWorld.elements[ 0 ];
        ribbon.matrix.elements[ 4 ] = ribbon.matrixRotationWorld.elements[ 4 ];
        ribbon.matrix.elements[ 8 ] = ribbon.matrixRotationWorld.elements[ 8 ];

        ribbon.matrix.elements[ 1 ] = ribbon.matrixRotationWorld.elements[ 1 ];
        ribbon.matrix.elements[ 5 ] = ribbon.matrixRotationWorld.elements[ 5 ];
        ribbon.matrix.elements[ 9 ] = ribbon.matrixRotationWorld.elements[ 9 ];

        ribbon.matrix.elements[ 2 ] = ribbon.matrixRotationWorld.elements[ 2 ];
        ribbon.matrix.elements[ 6 ] = ribbon.matrixRotationWorld.elements[ 6 ];
        ribbon.matrix.elements[ 10 ] = ribbon.matrixRotationWorld.elements[ 10 ];

        ribbon.matrix.multiplySelf( tmpRot );

        ribbon.matrix.scale( ribbon.scale );
        ribbon.boundRadiusScale = Math.max( ribbon.scale.x, Math.max( ribbon.scale.y, ribbon.scale.z ) );

        this.ribbons.push( ribbon );
        this.scene.add( ribbon );

        c ++;
    }

    this.scene.matrixAutoUpdate = false;

    this.timer = 0.;
}

Visual.prototype.Update = function(aTimeInterval)
{
    this.timer += (sTempoManager.GetTempo() / 120.) * aTimeInterval;
    var time = this.timer / 20.;

    this.camera.position.x += ( this.scene.position.x + Math.cos(time * -2.1) * 700 - this.camera.position.x) * 0.036;
    this.camera.position.y += ( this.scene.position.y + Math.sin(time * -1.33) * Math.sin(time * -1.13) * 600 - this.camera.position.y ) * 0.036;
    this.camera.position.z = this.scene.position.z + Math.cos(time * -1.2) * 400;

    this.camera.lookAt( this.scene.position );
    var lBuffer = sAudioInput.GetBuffer();
    zprev = 0.;
    z2prev = 0.;
    var valuebuf = 0;
    var i2;
    for ( i = -this.n; i < this.n; i ++ ) {
        i2 = i + this.n;
        valuebuf = lBuffer[Math.floor(i2 * lBuffer.length / (2 * this.n))];
        valuebuf *= valuebuf;

        z  =  13390 * valuebuf + 30 * (Math.sin( i2 * 0.02 + time * 25 ) * Math.cos( i2 * 0.02 + time * 45 ));
        z = 0.5 * z + 0.5 * zprev;
        zprev = z;
        z2 =  13420 * valuebuf + 40 * (Math.sin( i2 * 0.03 + time * 70 ) * Math.cos( i2 * 0.05 + time * 50 ) );//Math.cos( Math.sin( i2 * 0.1 + time * 20 ) );
        z2 = 0.5 * z2 + 0.5 * z2prev;
        z2prev = z2;

        this.geometry.vertices[ i2 ].z = z;
        this.geometry2.vertices[ i2 ].z = z2;
    }

    this.geometry.verticesNeedUpdate = true;
    this.geometry2.verticesNeedUpdate = true;

    var colorHSV = control.GetColorHSV('color');
    for( i = 0; i < this.nribbons; i++ ) {
        amp = 0.2;

        decay = amp + (1. - amp) * control.GetNumber('color');
        h = colorHSV.h + amp * (0.6 + 0.4 * Math.cos(time * 2. + 1.5 * i / this.nribbons));
        s = Math.min(Math.max(0, colorHSV.s + 0.5 * ( i % 20 / 20 )), 1.);
        this.materials[ i ].color.setHSV( h, s, 1. );
    }
}