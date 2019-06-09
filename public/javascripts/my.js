
$(document).on('pagebeforeshow ', '#home', function () {   // see: https://stackoverflow.com/questions/14468659/jquery-mobile-document-ready-vs-page-events
    var info_view = "";      //string to put HTML in
    $('#notes').empty();  // since I do this everytime the page is redone, 
    //I need to remove existing before apending them all again
    $.getJSON('/notelist/')   //Send an AJAX request
        .done(function (data) {
            $.each(data, function (index, record) {   // make up each li as an <a> to the details-page
                /* $('#notes').append('<li><a data-parm=' + record.subject.replace(/\s*$/, '').replace(" ", "%20") +
                     ' href="#details-page">' + record.subject + '</a></li>');
                 console.log(record.subject.replace(/\s*$/, '').replace(" ", "%20"));*/
                $('#notes').append('<li><a data-parm=' + record.name.replace(" ", "%20") +
                    ' href="#updatepage">' + record.name + '</a></li>');
                console.log(record.name);
            });
            $("#notes").listview('refresh');  // need this so jquery mobile will apply the styling to 
            //the newly added li's

            $("a").on("click", function (event) {    // set up an event, if user clicks any, 
                //it writes that items data-parm into the 
                //details page's html so I can get it there
                var parm = $(this).attr("data-parm");
                //do something here with parameter on  details page
                $("#detailParmHere").html(parm);
            });
        }); // end of .done
});

$(document).on('pagebeforeshow', '#details-page', function () {

    var textString = 'fix me';
    //var id = $('#detailParmHere').text();
    console.log(id);
    $.getJSON('/findnote/' + id)
        .done(function (data) {
            textString = "Subject: " + data.name + "<br /> Description: " + data.yearborn + "<br /> Priority: " + data.age;
            $('#showdata').html(textString);
        })
        .fail(function (jqXHR, textStatus, err) {
            textString = "could not find";
            $('#showdata').text(textString);
        });
});



$(document).on('pagebeforeshow', '#deletepage', function () {

    $('#deleteNote').val('');
});

function deleteNote() {
    var name = $('#deleteNote').val();
    $('#deleteNote').val('');
    $.ajax({
        url: '/deletenote/' + name,
        type: 'DELETE',
        contentType: "application/json",
        success: function (response) {
            alert("Note successfully deleted in cloud");
        },
        error: function (response) {
            alert("Note NOT deleted in cloud");
        }
    });
}

// clears the fields

$(document).on('pagebeforeshow', '#addpage', function () {
    $('#newSubject').val('');
    $('#newDescription').val('');
    $('#newPriority').val('');
});

function changeYear(){
    var name = $('#newSubject').val();
    var yearborn = $('#newDescription').val();
    var year_now = 2019;
    var age = year_now - parseInt(yearborn);
    console.log(yearborn)

    var suggestion = "";
    $("#newPriority").val(""+age);
    if(age < 35)
        suggestion = "Go to gym or sports";
    else if(age >= 35 && age <= 50)
        suggestion = "Maintain healthy eating";
    else if(age > 50)
        suggestion = "Travel a lot to take rest";
    $("#newSuggestion").val(""+suggestion);
}

function addItem() {
    var name = $('#newSubject').val();
    var yearborn = $('#newDescription').val();
    var age = parseInt($('#newPriority').val());
    var suggestion = $("#newSuggestion").val();
    var newNote = { "name": name, "yearborn": yearborn, "age": age, "description":suggestion};

    $('#newSubject').val('');
    $('#newDescription').val('');
    $('#newPriority').val('');
    $("#newSuggestion").val('');
    console.log(newNote)
    $.ajax({
        url: '/addnote/',
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(newNote),
    });
}

//starts here

$(document).on('pagebeforeshow', '#updatepage', function () {

    var textString2 = 'fix me';
    var id2 = $('#detailParmHere').text();
    console.log(id2);
    $.getJSON('/findnote/' + id2)
        .done(function (data) {
            console.log(data)
            //textString2 = "Subject: " + data.subject + "<br /> Description: " + data.description + "<br /> Priority: " + data.priority;
            $('#showOldname').html(data.name);
            $('#newName').val(data.name);
            $('#newYearBorn').val(data.yearborn);
            $('#newAge').val(data.age);
            $('#newID').val(data._id);
        })
        .fail(function (jqXHR, textStatus, err) {
            textString2 = "could not find";
            $('#showOldname').text(textString2);
        });
});

function changeYearInUpdate(){
    var name = $('#newName').val();
    var yearborn = $('#newYearBorn').val();
    var year_now = 2019;
    var age = year_now - parseInt(yearborn);
    console.log(yearborn)
    var suggestion = "";
    $("#newAge").val(""+age);
    if(age < 35)
        suggestion = "Go to gym or sports";
    else if(age >= 35 && age <= 50)
        suggestion = "Maintain healthy eating";
    else if(age > 50)
        suggestion = "Travel a lot to take rest";
    $("#newSuggestion1").val(""+suggestion);
}

function updateItem() {
    var oldname = document.getElementById('showOldname').innerHTML;
    var name = $('#newName').val();
    var yearborn = $('#newYearBorn').val();
    var age = parseInt($('#newAge').val());
    var suggestion = $("#newSuggestion1").val();
    var who_id = $('#newID').val();
    var newNote2 = { "name": name, "yearborn": yearborn, "age": age, "_id": who_id, "suggestion": suggestion };
    //$('#newSubject').val('');
    //$('#newDescription').val('');
    //$('#newPriority').val('');

    $.ajax({
        url: '/updatenote/' + oldname,//changed
        type: 'POST',//changed
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(newNote2),
        success: function (result) {
            alert("success");
            window.location.href = '/';
        }

    });
}

//ends here

