/*                                                                            */
/*                                                 ▄▄▄▄ ▄▄▄                   */
/*                                              ▄▀▀   ▀█   █                  */
/*                                            ▄▀  ▄██████▄ █                  */
/*                                           ▄█▄█▀  ▄ ▄ █▀▀▄                  */
/*                                          ▄▀ ██▄  ▀ ▀ ▀▄ █                  */
/*       pamicel@student.42.fr              ▀▄  ▀ ▄█▄▄  ▄█▄▀                  */
/*       march 2017                           ▀█▄▄  ▀▀▀█▀ █                   */
/*                                           ▄▀   ▀██▀▀█▄▀                    */
/*       Vehicle.js                         █  ▄▀▀▀▄█▄  ▀█                    */
/*                                          ▀▄█     █▀▀▄▄▀█                   */
/*                                           ▄▀▀▄▄▄██▄▄█▀  █                  */
/*                                          █▀ █████████   █                  */
/*                                          █  ██▀▀▀   ▀▄▄█▀                  */
/*                                           ▀▀                               */
/*                                                                            */

/*
** Vehicle Object
**      physicle object with position, velocity, acceleration,
**      mass, and ability to gain or loose said mass.
**
**  this.expansionRate is treated as the 'velocity' with which the Vehicle
**  might expand and this.expansionDiff is treated, in the same way, as the
**  acceleration. One can picture the vehicle instance being filled with sand :
**  the rate at which the sand fills the vehicle is this.expansionRate and if
**  this.expansionDiff has a value (!= 0), this.expansionRate varies.
**
** this.maxSpeed is for esthetic purpose (nothing shoud move to fast)
** this.maxForce limits a vehicle's ability to move itselves
*/

function Vehicle(x, y, mass)
{
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.expansionRate = 0;
    this.expansionDiff = 0;
	this.maxSpeed = 15;
	this.maxForce = 2;
}

/*
** update() computes all physical changes since last used
** and sets this.acc to zero
*/

Vehicle.prototype.update = function()
{
    this.expansionRate += this.expansionDiff;
    this.mass += this.expansionRate;
    this.expansionDiff = 0;
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
}

/*
** applyForce : acceleration += force/mass
*/

Vehicle.prototype.applyForce = function(force)
{
    this.acc.add(force.div(this.mass));
}

/*
** applyInternalForce : acceleration += force.limit(this.maxForce) / mass
*/

Vehicle.prototype.applyInternalForce = function(force)
{
    this.applyForce(force.limit(this.maxForce));
}

/*
** applyExpansionForce :
**      this.expansionRate is treated as the 'velocity' with which the Vehicle
**      might expand and this.expansionDiff is treated, in the same way, as the
**      acceleration. One can picture the vehicle instance being filled with
**      sand : the rate at which the sand fills the vehicle is
**      this.expansionRate and if this.expansionDiff has a value (!= 0),
**      this.expansionRate varies.
**      In this context an 'expansionForce' could be the force needed to, say,
**      tilt the sand container.
*/

Vehicle.prototype.applyExpansionForce = function(expansionForce)
{
    this.expansionDiff += expansionForce;
}

/*
** calculateSteering : steering = desire - velocity
*/

Vehicle.prototype.calculateSteering = function(desire)
{
    return (p5.Vector.sub(desire, this.vel));
}

/*
** agitate : Very dull random agitation
*/

Vehicle.prototype.agitate = function(agitation)
{
    let x = random(-agitation, agitation);
    let y = random(-agitation, agitation);
    return (createVector(x, y));
}

/*
** arrive : uses the vehicle steering behaviour to go to a target and
**      decelerate upon arrival at a certain distance from that target
**      (this.space)
*/

Vehicle.prototype.arrive = function(target, intensity = 1, spaceFactor = 1)
{
    var desire;
    var dist;

    desire = p5.Vector.sub(target, this.pos);
    dist = desire.mag();
    if (dist < this.space)
        desire.setMag(map(dist, 0, this.space * spaceFactor, 0, this.maxSpeed * intensity));
    else
        desire.setMag(this.maxSpeed * intensity);
    return (this.calculateSteering(desire));
}

Vehicle.prototype.gravitate = function(target, targetMass, g)
{
    let f;
    let dist;

    f = p5.Vector.sub(target, this.pos);
    dist = p5.Vector.dist(target, this.pos);
    f.setMag(g * targetMass * this.mass / (dist * dist));
    this.applyForce(f);
}
