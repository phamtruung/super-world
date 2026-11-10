class DivHeader {
    constructor({elFather, appName}) {

        // Main
        this.elMain = UI.Div.Row(UI.ClassName.Header);
        elFather.appendChild(this.elMain);

        // Filter Option
        const optionsDict = {
            0: "--Mặc định --",
            1: "Châu Lục: 6 Châu",
            2: "Khu Vực: 23 Khu",
            3: "Mật Độ (người/km2)",
            4: "GDP Người ($/người/năm)",
            5: "Forex",
            6: "Thể Chế",
            7: "Dầu Mỏ (TWh)",
            8: "Vàng Tài Nguyên (tấn)",
            9: "Vàng Dự Trữ (tấn)",
            10: "Vàng Tổng Hợp (tấn)",
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

