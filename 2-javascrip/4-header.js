class DivHeader {
    constructor({elFather, appName}) {

        // Main
        this.elMain = UI.Div.Row(UI.ClassName.Header);
        elFather.appendChild(this.elMain);

        // Filter Option
        const optionsDict = {
            0: "--Mặc định --",
            1: "Châu Lục",
            2: "Dân Số",
            3: "GDP",
            4: "Forex",
            5: "Thể Chế"
        };
        this.elFilter = UI.Input.Select(optionsDict);
        this.elFilter.id = UI.IDName.SelectFilter;
        this.elMain.appendChild(this.elFilter);

        // Span
        this.elMain.appendChild(UI.Div.Row());

        // Search
        this.elSearch = UI.Input.Text();
        this.elSearch.id = UI.IDName.SearchInput;
        this.elSearch.placeholder = "Tìm kiếm";
        this.elMain.appendChild(this.elSearch);

        // Result
        this.elSearchResult = UI.Div.Column();
        this.elSearchResult.id = UI.IDName.SearchResult;
        this.elMain.appendChild(this.elSearchResult);

        // Span
        this.elMain.appendChild(UI.Div.Row());

        // Name
        this.elAppName = UI.Paragraph.Header(appName);
        this.elAppName.classList.add(UI.ClassName.AppName);
        this.elMain.appendChild(this.elAppName);
        
    }


}

