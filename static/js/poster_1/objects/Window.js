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

function Win(data, wid, hei, title) {
    this.data = data;
    this.width = wid;
    this.height = hei;
    this.title = title;
}

Win.prototype.addDataPoint = function(dataPoint)
{
    this.data.push(dataPoint);
    if (this.data.length > this.width)
    {
        this.data.splice(0, 1);
    }
}

Win.prototype.show = function(xPos, yPos, min, max)
{
    push();
    translate(xPos, yPos);
    noStroke();
    fill('white');
    text(this.title, -10, -20);
    strokeWeight(1);
    stroke('white');
    fill('black');
    rect(-10, -10, this.width + 20, this.height + 20);
    push();
    noFill();
    beginShape();
    let maxed = false;
    for (i in this.data)
    {
        if (abs(this.data[i]) > max)
        {
            max = abs(this.data[i]);
            min = - abs(this.data[i]);
            maxed = true;
        }
        if (abs(this.data[i]) < (0.1 * max) && !maxed)
        {
            max = abs(this.data[i]);
            min = - abs(this.data[i]);
        }
    }
    for (i in this.data)
    {
        vertex(i, map(this.data[i], min, max, this.height, 0));
    }
    endShape();
    pop();
    pop();
}
