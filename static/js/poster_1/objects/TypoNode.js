/*                                                                            */
/*                                                 ▄▄▄▄ ▄▄▄                   */
/*                                              ▄▀▀   ▀█   █                  */
/*                                            ▄▀  ▄██████▄ █                  */
/*                                           ▄█▄█▀  ▄ ▄ █▀▀▄                  */
/*                                          ▄▀ ██▄  ▀ ▀ ▀▄ █                  */
/*       pamicel@student.42.fr              ▀▄  ▀ ▄█▄▄  ▄█▄▀                  */
/*       march 2017                           ▀█▄▄  ▀▀▀█▀ █                   */
/*                                           ▄▀   ▀██▀▀█▄▀                    */
/*       TypoNode.js                        █  ▄▀▀▀▄█▄  ▀█                    */
/*                                          ▀▄█     █▀▀▄▄▀█                   */
/*                                           ▄▀▀▄▄▄██▄▄█▀  █                  */
/*                                          █▀ █████████   █                  */
/*                                          █  ██▀▀▀   ▀▄▄█▀                  */
/*                                           ▀▀                               */
/*                                                                            */

/**
 * TypeDef :
 * {p5Color} ::= {Number|String|Object}
 *               number or string representation of a color or p5.Color object
 */

TypoNode.prototype = Object.create(Vehicle.prototype);
/**
 * A TypoNode is a physicle object (Vehicle) with an added position vector
 * (anker) defined at construction
 *
 * @constructor TypoNode
 * @extends Vehicle
 * @param   {Number}    x
 * @param   {Number}    y
 * @param   {Number}    mass            positive number
 * @param   {Object}    anker           2D P5.Vector
 */

function TypoNode(x, y, mass, anker = createVector(x, y))
{
    Vehicle.call(this, x, y, mass);
    this.isConnected = false;
    // isConnected is true either if this has members in this.connections or if
    //      it is a member in an other node's connections.
    this.connections = [];
    this.anker = anker;
    this.space = mass / 2;
    // this.k = ;
    this.color = 255;
    this.hue = 0;
    this.sat = 0;
    this.bri = 100;
    this.colDiff = 0;  //|
    this.hueDiff = 0;  //|- in case I want to have a natural color change
    this.briDiff = 0;  //|
    this.label;
}

/**
 * @method showAnker
 * @param   {Number}    dx
 * @param   {Number}    dy
 * @param   {p5Color}   color
 */

TypoNode.prototype.showAnker = function(dx = 0, dy = 0, color = this.color)
{
    push();
    let ank = this.anker;
    push();
    noFill();
    stroke(color);
    strokeWeight(1);
    ellipse(ank.x - dx, ank.y - dy, this.mass, this.mass);
    pop();
}


/**
 * @method showConnections
 * @param   {Number}    thickness   defaults to this.mass
 * @param   {p5Color}   color       defaults to this.color
 */

TypoNode.prototype.showConnections = function(thickness = this.mass, color = this.color)
{
    if (this.isConnected)
    {
        push();
        stroke(color);
        strokeWeight(thickness);
        for (let i = 0; i < this.connections.length; i++)
        {
            let conn = this.connections[i];
            line(conn.pos.x, conn.pos.y, this.pos.x, this.pos.y);
        }
        pop();
    }
}

/**
 * @method show
 * @param   {Number}   hue
 */

TypoNode.prototype.show = function(hue = this.hue, sat = this.sat, bri = this.bri, opacity)
{
    push();
    noStroke();
    fill(hue, sat, bri, opacity);
    rect(this.pos.x, this.pos.y, this.mass, this.mass);
    rect(this.pos.x -  5, this.pos.y -  5, this.mass, this.mass);
    rect(this.pos.x - 10, this.pos.y - 10, this.mass, this.mass);
    rect(this.pos.x - 15, this.pos.y - 15, this.mass, this.mass);
    rect(this.pos.x - 20, this.pos.y - 20, this.mass, this.mass);
    rect(this.pos.x - 25, this.pos.y - 25, this.mass, this.mass);
    rect(this.pos.x - 30, this.pos.y - 30, this.mass, this.mass);
    rect(this.pos.x - 35, this.pos.y - 35, this.mass, this.mass);
    rect(this.pos.x - 40, this.pos.y - 40, this.mass, this.mass);
    rect(this.pos.x - 45, this.pos.y - 45, this.mass, this.mass);
    rect(this.pos.x - 50, this.pos.y - 50, this.mass, this.mass);
    rect(this.pos.x - 55, this.pos.y - 55, this.mass, this.mass);
    rect(this.pos.x - 60, this.pos.y - 60, this.mass, this.mass);
    pop();
}

/**
 * @method isAround
 * @param   {Number}    x
 * @param   {Number}    y
 */

TypoNode.prototype.isAround = function(x, y)
{
    return (this.pos.x < x + this.space &&
            this.pos.x > x - this.space &&
            this.pos.y < y + this.space &&
            this.pos.y > y - this.space);
}

/**
 * addConnectionTo adds other to the array this.connections
 * this.connections can include at most TOO_MANY_FRIENDS friends, cannot include
 * twice the same TypoNode and cannot include the current (this)
 *
 * @method addConnectionTo
 * @param   {Object}    other           a TypoNode object
 * @return  {String}    a string message of what the fonction has done
 */

const TOO_MANY_FRIENDS = 3;
const OK_ADDED_CONNECTION = "Connection added";
const ERR_CONNECT_TO_SELF = "Cannot add itself as a connection";
const ERR_CONNECT_LIST_FULL = "Connections list full for both ends";
const ERR_ALREADY_CONNECTED = "Ends are already connected";

TypoNode.prototype.addConnectionTo = function(other)
{
    if (other === this)
        return (ERR_CONNECT_TO_SELF);
    if (this.isConnectedTo(other) || other.isConnectedTo(this))
        return (ERR_ALREADY_CONNECTED);
    if (this.connections.length >= TOO_MANY_FRIENDS)
    {
        if (other.connections.length < TOO_MANY_FRIENDS)
            return (other.addConnectionTo(this));
        else
            return (ERR_CONNECT_LIST_FULL);
    }
    this.connections.push(other);
    // Both isConnected values have to be switched on
    other.isConnected = true;
    this.isConnected = true;
    return (OK_ADDED_CONNECTION);
}

/**
 * isConnectedTo checks weither 'this' has 'other' in this.connections
 * (!) isConnectedTo does NOT check weither other.connections includes 'this'
 *
 * @method isConnectedTo
 * @param   {Object}    other                   a TypoNode object
 * @return  {Boolean}   true if 'other' is included in this.connections
 */

TypoNode.prototype.isConnectedTo = function(other)
{
    for (var i = 0; i < this.connections.length; i++)
        if (this.connections[i] === other)
            return (true);
    return (false);
}

/**
 * removeConnection remove ANY connection between this and other
 *
 * @method removeConnection
 * @param   {Object}    other                   a TypoNode object
 * @return  {String}    a string describing the behaviour of the function
 */

const OK_REMOVED_CONNECTION = "Connection removed";
const ERR_NOT_CONNECTED = "The two TypoNodes are not connected";

TypoNode.prototype.removeConnection = function(other)
{
    if (other.isConnectedTo(this) && !this.isConnectedTo(other))
    {
        other.removeConnection(this);
    }
    for (var i = 0; i < this.connections.length; i++)
        if (this.connections[i] === other)
        {
            this.connections.splice(i, 1);
            this.isConnected = this.connections.length > 0;
            return (OK_REMOVED_CONNECTION);
        }
    return (ERR_NOT_CONNECTED);
}

/**
 * removeAllConnections removes ANY connection between this and
 * all elmts in this.connections
 *
 * @method removeAllConnections
 * @param   {Array}     allNodes                an array of nodes to be
 *                                              potentially disconnected
 * @return  {Number}    the number of connections removed
 */

TypoNode.prototype.removeAllConnections = function(allNodes)
{
    ret = 0;

    if (this.isConnected)
        for (i in allNodes)
            if (allNodes[i] !== this)
                if (this.removeConnection(allNodes[i]) == OK_REMOVED_CONNECTION)
                    ret++;
    return (ret);
}

/**
 * separate applies a separation force between this and other
 *
 * @method separate
 * @param   {Object}    other                   a TypoNode object
 * @param   {Number}    entropy                 intensity of the behaviour
 * @return  {Number}    0 if they were not close enough to apply a force
 *                      1 otherwise
 */

TypoNode.prototype.separate = function(other, entropy)
{
    let desire, dist;

    desire = p5.Vector.sub(this.pos, other.pos);
    dist = desire.mag();
    desire.limit(this.maxSpeed);
    this.applyForce(this.calculateSteering(desire).mult(entropy));
}

/**
 * spring : f = -k.d
 *
 * @method spring
 * @param   {Object}    target                  p5.Vector
 * @param   {Number}    k                       spring constant
 * @return  {Object}    spring force between this and target (p5.Vector)
 */

TypoNode.prototype.spring = function(target, k)
{
    let dist_vect;

    dist_vect = p5.Vector.sub(this.pos, target);
    return (p5.Vector.mult(dist_vect, -k));
}
