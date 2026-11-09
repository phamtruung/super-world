class DivLeft {
    constructor(elFather) {
        // Main
        this.elMain = UI.Div.Column(UI.ClassName.FixPanel, false);
        this.elMain.classList.add(UI.ClassName.Scroll);
        elFather.appendChild(this.elMain);

        // Content
        this.elContent = UI.Div.Column();
        this.elMain.appendChild(this.elContent);
    }

}