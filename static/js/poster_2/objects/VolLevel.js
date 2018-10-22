function VolLevel(w, h)
{
    this.x = 0;
    this.y = 0;
    this.w = w;
    this.h = h;
    this.minH = 2;
    this.textOff = 20;

    this.show = function(vol, width, height, world)
    {
        const MIN_HEIGHT = 2;
        const RIGHT = 20;
        const VOL_LEV_BOTTOM = world.buttonColumn.bottom + 20;
        let less = map(vol, 1, 0, 0, this.h - this.minH);

        this.x = width - this.w - RIGHT;
        this.y = height - this.h - VOL_LEV_BOTTOM;
        push();
        fill("lightgreen");
        noStroke();
        rect(this.x, this.y + less, this.w, this.h - less);
        text("VOL", this.x + this.w / 2, this.y + this.h + this.textOff);
        pop();
    }

    this.isAround = function(mouseX, mouseY)
    {
        return (mouseX < this.x + this.w                &&
                mouseX > this.x                         &&
                mouseY < this.y + this.h + this.textOff &&
                mouseY > this.y                         );
    }
}
