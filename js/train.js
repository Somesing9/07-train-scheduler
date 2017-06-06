$("#btn-search").on("click", function() {
    // var searchTerm = $("#search-term");
    // var records = $("#records");
    // var startYear = $("#start-year");
    // var endYear = $("#end-year");

	var searchTerm = "lebron";
    var records = $("#records");
    var startYear = "2001";
    var endYear = "2010";

    // Built by LucyBot. www.lucybot.com
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "1404ec14afd94ed6ad856d78a72c23d1",
        'q': searchTerm,
        'begin_date': startYear + "0101",
        'end_date': endYear + "0101"
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {
        console.log(result);
    }).fail(function(err) {
        throw err;
    });
});
