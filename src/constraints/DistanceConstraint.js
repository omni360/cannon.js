module.exports = DistanceConstraint;

var Constraint = require('./Constraint');
var ContactEquation = require('../equations/ContactEquation');

/**
 * Constrains two bodies to be at a constant distance from each other.
 * @class DistanceConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Number} [distance] If undefined, it will be set to the current distance between bodyA and bodyB
 * @param {Number} [maxForce=1e6]
 * @extends Constraint
 */
function DistanceConstraint(bodyA,bodyB,distance,maxForce){
    Constraint.call(this,bodyA,bodyB);

    if(typeof(distance)==="undefined" ) {
        distance = bodyA.position.distanceTo(bodyB.position);
    }

    if(typeof(maxForce)==="undefined" ) {
        maxForce = 1e6;
    }

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new ContactEquation(bodyA,bodyB), // Just in the normal direction
    ];

    var normal = eqs[0];

    normal.minForce = -maxForce;
    normal.maxForce =  maxForce;

    // Update
    this.update = function(){
        bodyB.position.vsub(bodyA.position,normal.ni);
        normal.ni.normalize();
        /*bodyA.quaternion.vmult(pivotA,normal.ri);
        bodyB.quaternion.vmult(pivotB,normal.rj);*/
        normal.ni.mult( distance*0.5,normal.ri);
        normal.ni.mult( -distance*0.5,normal.rj);
    };
}
DistanceConstraint.prototype = new Constraint();
