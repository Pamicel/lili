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

/*
** Pastille objects are simplified TypoNodes used for efficient saving
*/

function Pastille(typoNode)
{
    this.x                  = typoNode.pos.x;
    this.y                  = typoNode.pos.y;
    this.ankerX             = typoNode.anker.x;
    this.ankerY             = typoNode.anker.y;
    this.mass               = typoNode.mass;
    this.maxSpeed           = typoNode.maxSpeed;
    this.maxForce           = typoNode.maxForce;
    this.isConnected        = typoNode.isConnected;
    this.color              = typoNode.color;
    this.label              = typoNode.label;
    this.space              = typoNode.space;
}

function extractNode(pastille)
{
    var anker  = createVector(pastille.ankerX, pastille.ankerY);
    var node   = new TypoNode(pastille.x, pastille.y, /*pastille.mass*/POSTER_WORLD.nodeMass, anker);

    node.maxSpeed           = pastille.maxSpeed;
    node.maxForce           = pastille.maxForce;
    node.isConnected        = pastille.isConnected;
    node.color              = pastille.color;
    node.label              = pastille.label;
    // node.space              = pastille.space;
    return (node);
}

/*
** Punch objects are simplified Letters used for efficient saving
*/

function Punch(letter)
{
    this.centerPastille     = new Pastille(letter.center);
    this.dimensions         = letter.dimensions;
    this.pastilles          = [];
    this.connectionsTab     = [];

    for (i in letter.nodes)
    {
        this.pastilles.push(new Pastille(letter.nodes[i]));
    }
    for (i in letter.nodes)
    {
        if (!letter.nodes[i].isConnected)
            this.connectionsTab.push([]);
        else
        {
            this.connectionsTab.push([]);
            for (j in letter.nodes)
                if (letter.nodes[i].isConnectedTo(letter.nodes[j]))
                    this.connectionsTab[i].push(j);
        }
    }
}

function engrave(punch)
{
    var letter = new NodeLetter();

    letter.center = extractNode(punch.centerPastille);
    letter.dimensions = punch.dimensions;
    for (i in punch.pastilles)
        letter.nodes.push(extractNode(punch.pastilles[i]))
    for (origin in punch.connectionsTab)
    {
        if (punch.connectionsTab[origin].length != 0)
        {
            for (j in punch.connectionsTab[origin])
            {
                let dest = punch.connectionsTab[origin][j];
                letter.nodes[origin].addConnectionTo(letter.nodes[dest]);
            }
        }
    }
    return (letter);
}
