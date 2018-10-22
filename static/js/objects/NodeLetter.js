/*                                                                            */
/*                                                 ▄▄▄▄ ▄▄▄                   */
/*                                              ▄▀▀   ▀█   █                  */
/*                                            ▄▀  ▄██████▄ █                  */
/*                                           ▄█▄█▀  ▄ ▄ █▀▀▄                  */
/*                                          ▄▀ ██▄  ▀ ▀ ▀▄ █                  */
/*       pamicel@student.42.fr              ▀▄  ▀ ▄█▄▄  ▄█▄▀                  */
/*       march 2017                           ▀█▄▄  ▀▀▀█▀ █                   */
/*                                           ▄▀   ▀██▀▀█▄▀                    */
/*                                          █  ▄▀▀▀▄█▄  ▀█                    */
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



// // // // // // // // // // // // // // // // // // // // // // // // // // //

//                                  MODEL                                     //

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * NodeLetter
 *
 * @class NodeLetter
 * @constructor
 * @param  {Number}     centerX
 * @param  {Number}     centerY                 coordinates of this.center
 */

function NodeLetter(centerX = 100, centerY = 100)
{
    this.nodes = [];
    this.center = new TypoNode(centerX, centerY, 20);
    this.center.color = "lightblue";
    this.dimensions = {
        chasse : 350,
        encombrement : 310,
        hx : 200,
        hcapitale : 400,
        hcorps : 450
    };
}

/**
 * update is the core function of a physically animated object
 * Every node in this.nodes is subject to
 *      - A spring force towards its own anker
 *      - Friction
 * this.center is only subject to an 'arrive' behaviour towards its anker
 *
 * @method update
 * @param   {Number}    k                       spring constant
 * @param   {Number}    friction                friction coeffecient
 */

NodeLetter.prototype.update = function(k = 0.001, friction = .5)
{
    for (let i = 0; i < this.nodes.length; i++)
    {
        let f = this.nodes[i].spring(this.nodes[i].anker, k);
        this.nodes[i].applyExpansionForce(((this.nodes[i].space * 2) - this.nodes[i].mass) * 0.1); // back to normal size
        this.nodes[i].applyExpansionForce(- this.nodes[i].expansionRate * 0.1); // expansion friction
        this.nodes[i].applyForce(f);
        this.nodes[i].applyForce(p5.Vector.mult(this.nodes[i].vel, -friction));
        this.nodes[i].update();
    }
    let f = this.center.arrive(this.center.anker);
    this.center.applyForce(f);
    this.center.update();
}

/**
 * closeToWhichNode returns the first index in this.nodes of a node close enough
 * to pos. Distance reference is nodes[i].space.
 *
 * @method closeToWhichNode
 * @param   {Object}    pos                     position to evaluate,
 *                                              p5.Vector object
 * @return  {Number}    index in this.nodes of node close enough to pos.
 *                      -1 if no node was close enough.
 */

NodeLetter.prototype.closeToWhichNode = function(pos)
{
    pos = p5.Vector.sub(pos, this.center.pos);
    for (let i = 0; i < this.nodes.length; i++)
        if (this.nodes[i].pos.dist(pos) < this.nodes[i].space)
            return (i);
    return (-1);
}



// // // // // // // // // // // // // // // // // // // // // // // // // // //

//                                  VIEW                                      //

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * setPosition changes the position of the center
 *
 * @method setPosition
 * @param   {Number}        x
 * @param   {Number}        y
 */

 NodeLetter.prototype.setPosition = function(x, y)
 {
     //console.log(this.center.pos.x);
     this.center.pos.x = x;
     this.center.pos.y = y;
     this.center.anker.x = x;
     this.center.anker.y = y - 20;
     //console.log(this.center.pos.x, this.center.pos.y, this.center.anker.x, this.center.anker.y);
 }

/**
 * showCenter renders this.center
 *
 * @method showCenter
 * @param   {p5Color}       color               color string or number or
 *                                              p5.Color object
 */

NodeLetter.prototype.showCenter = function(color = this.center.color)
{
    let pos = this.center.pos;

    push();
    noStroke();
    fill(color);
    ellipse(pos.x, pos.y, this.center.mass, this.center.mass);
    pop();
}

/**
 * showDimensions renders the vertical and horizontal limits of the letter
 *
 * @method showDimensions
 * @param  {Number}     height                  height of canvas
 * @param  {Number}     width                   width of canvas
 * @param  {p5Color}    color                   color used for rendering
 * @param  {Number}     weight                  thickness of lines
 */

NodeLetter.prototype.showDimensions
= function(height, width, color = this.center.color, weight = 1)
{
    let pos = this.center.pos;
    let encombrement = this.dimensions.encombrement;
    // let chasse = this.dimensions.chasse;
    let hx = this.dimensions.hx;
    let hcapitale = this.dimensions.hcapitale;
    let hcorps = this.dimensions.hcorps;

    push();
    stroke(color);
    strokeWeight(weight);
    line(pos.x - (encombrement / 2), 0, pos.x - (encombrement / 2), height);
    line(pos.x + (encombrement / 2), 0, pos.x + (encombrement / 2), height);
    // line(pos.x - (chasse / 2), 0, pos.x - (chasse / 2), height);
    // line(pos.x + (chasse / 2), 0, pos.x + (chasse / 2), height);
    line(0, pos.y + hx, width, pos.y + hx);
    line(0, pos.y, width, pos.y);
    line(0, pos.y - hcapitale + hx, width, pos.y - hcapitale + hx);
    line(0, pos.y - hcorps + hx, width, pos.y - hcorps + hx);
    pop();
}

/**
 * show renders the Letter
 *
 * @method show
 * @param   {Number}    connectionsThickness    thickness of connections
 *                                              between nodes
 */

NodeLetter.prototype.show = function(connectionsThickness, hue, sat, bri, opacity, x, y)
{
    push();
    translate((x ? x : this.center.pos.x), (y ? y : this.center.pos.y));
    for (let i = 0; i < this.nodes.length; i++)
    {
        this.nodes[i].showConnections(connectionsThickness);
        this.nodes[i].show(hue, sat, bri, opacity);
    }
    pop();
}



// // // // // // // // // // // // // // // // // // // // // // // // // // //

//                                  CONTROL                                   //

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * eraseConnection uses an other Node object (eraser) to erase any close by
 * connection between two TypoNode objects in this.nodes
 *
 * @method eraseConnection
 * @param   {Object}    eraser                  TypoNode object
 * @return              1 on success
 *                      0 on failure
 */

NodeLetter.prototype.eraseConnection = function(eraser)
{
    for (let i = 0; i < this.nodes.length; i++)
    {
        if (this.nodes[i].isConnected)
        {
            for (let j = 0; j < this.nodes[i].connections.length; j++)
            {
                let node = this.nodes[i];
                let conn = this.nodes[i].connections[j];
                let offPos = p5.Vector.sub(eraser.pos, this.center.pos);
                let distToFirst = offPos.dist(node.pos);
                let distToSecond = offPos.dist(conn.pos);
                let distBetween = node.pos.dist(conn.pos);
                let tolerance = eraser.space / 20;

                if (distToFirst + distToSecond <= distBetween + tolerance)
                    return (node.removeConnection(conn) == OK_REMOVED_CONNECTION);
            }
        }
    }
    return (0);
}

/**
 * eraseNode uses an other Node object (eraser) to erase a close by node in
 * this.nodes
 *
 * @method eraseNode
 * @param   {Object}    eraser                  TypoNode object
 * @return              1 on success
 *                      0 on failure
 */

NodeLetter.prototype.eraseNode = function(eraser)
{
    for (let i = 0; i < this.nodes.length; i++)
    {
        let offPos = p5.Vector.sub(eraser.pos, this.center.pos);
        let d = offPos.dist(this.nodes[i].pos);
        let r1r2 = eraser.space + this.nodes[i].space;

        if (d < r1r2)
        {
            if (this.nodes[i].isConnected)
                this.nodes[i].removeAllConnections(this.nodes);
            this.removeNode(this.nodes[i]);
            return (1);
        }
    }
    return (0);
}

/**
 * connectToCloseNodes connects currentNode and all the nodes in this.nodes that
 * are close enough to it. Distance of reference is this.nodes[i].space.
 *
 * @method connectToCloseNodes
 * @param   {Object}    currentNode             TypoNode object
 * @return              1 if connection has been created
 *                      0 if no connection was created
 */

NodeLetter.prototype.connectToCloseNodes = function(currentNode)
{
    for (let i = 0; i < this.nodes.length; i++)
    {
        if (this.nodes[i] !== currentNode)
        {
            let d = currentNode.pos.dist(this.nodes[i].pos);
            let r1r2 = currentNode.space + this.nodes[i].space;
            if (d < r1r2)
                return (this.nodes[i].addConnectionTo(currentNode) == OK_ADDED_CONNECTION);
        }
    }
    return (0);
}

/**
 * removeNode deletes node form this.nodes.
 * If node is not included in this.node removeNode does nothing.
 *
 * @method removeNode
 * @param   {Object}    node                    TypoNode object to be
 *                                              removed
 */

NodeLetter.prototype.removeNode = function(node)
{
    for (let i = 0; i < this.nodes.length; i++)
        if (this.nodes[i] === node)
            this.nodes.splice(i, 1);
}

/**
 * newNode takes a position and creates a new TypoNode Object from it. If the
 * argument gridSnapOn is true, attaches it to the closest grid position.
 *
 * @method newNode
 * @param   {Number}    x                       x coordinate
 * @param   {Number}    y                       y coordinate
 * @param   {Boolean}   gridSnapOn              true is new node has to
 *                                              attach to grid.
 * @param   {Number}    density                 density of the grid.
 */

NodeLetter.prototype.newNode
= function(x, y, mass, gridSnapOn = false, density = 1)
{
    x -= this.center.pos.x;
    y -= this.center.pos.y;
    if (gridSnapOn)
    {
        x = gridSnaper(x, density);
        y = gridSnaper(y, density);
    }
    this.nodes.push(new TypoNode(x, y, mass));
}

/**
 * expandNodes applies an expansionForce to all nodes in the letter
 *
 * @method expandNodes
 * @param   {Number}    forceMag                intensity of the force applied
 */

NodeLetter.prototype.expandNodes = function(forceMag)
{
    for (i in this.nodes)
        this.nodes[i].applyExpansionForce(forceMag);
}

/**
 * expandLinks behaviour applies an counter attraction between connected nodes
 *
 * @method expandLinks
 * @param   {Number}    entropy                 intensity of the force applied
 */

NodeLetter.prototype.expandLinks = function(forceMag)
{
    for (i in this.nodes)
        if (this.nodes[i].isConnected)
            for (j in this.nodes[i].connections)
            {
                let nodA = this.nodes[i];
                let nodB = this.nodes[i].connections[j];
                let dir = p5.Vector.sub(nodB.pos, nodA.pos);
                nodA.applyForce(p5.Vector.mult(dir, -forceMag));
                nodB.applyForce(p5.Vector.mult(dir, forceMag));
            }
}

/**
 * expandLetter behaviour applies an counter attraction between all nodes
 *
 * @method expandLetter
 * @param   {Number}    entropy                 intensity of the force applied
 */

NodeLetter.prototype.expandLetter = function(forceMag)
{
    for (i in this.nodes)
        for (j in this.nodes)
            if (this.nodes[j] !== this.nodes[i])
            {
                let nodA = this.nodes[i];
                let nodB = this.nodes[j];
                let dir = p5.Vector.sub(nodB.pos, nodA.pos);
                nodA.applyForce(p5.Vector.mult(dir, -forceMag));
                nodB.applyForce(p5.Vector.mult(dir, forceMag));
            }
}

/**
 * shrinkLetter behaviour applies an attraction between all nodes
 *
 * @method expandLetter
 * @param   {Number}    entropy                 intensity of the force applied
 */

NodeLetter.prototype.shrinkLetter = function(forceMag)
{
    for (i in this.nodes)
        for (j in this.nodes)
            if (this.nodes[j] !== this.nodes[i])
            {
                let nodA = this.nodes[i];
                let nodB = this.nodes[j];
                let dir = p5.Vector.sub(nodB.pos, nodA.pos);
                nodA.applyForce(p5.Vector.mult(dir, forceMag));
                nodB.applyForce(p5.Vector.mult(dir, -forceMag));
            }
}
