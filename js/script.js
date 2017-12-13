var userinfo;
var antwoorden = [];

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function connectToMagister() {
    $.get("https://lu1t.nl/magister.php?username=" + encodeURIComponent($("#username").val()) + "&password=" + encodeURIComponent($("#password").val()), function(data) {
            userinfo = JSON.parse(data);
            if (userinfo.error) {
                $("#magister").fadeOut("", function() {
                    $("#error").fadeIn();
                });
            } else if (userinfo.success && !userinfo.error && !userinfo.ingevuld) {
                $("#magister").fadeOut("", function() {
                    $("#vraag1").fadeIn();
                });
                userinfo.vakken = shuffle(userinfo.vakken);
                $.each(userinfo.vakken, function(i, vak) {
                    if ($.inArray(vak.afkorting, ["me", "rt3F", "MS", "mvt"]) === -1 && vak.afkorting.indexOf("sl_") === -1 && vak.afkorting.indexOf("co_") === -1) {
                        $(".vakkenmoeite").append("<p><input name='moeite' type='checkbox' id='m" + vak.afkorting + "' /><label for='m" + vak.afkorting + "'>" + vak.omschrijving + "</label></p>");
                        $(".vakkenuitdaging").append("<p><input name='uitdaging' type='checkbox' id='u" + vak.afkorting + "' /><label for='u" + vak.afkorting + "'>" + vak.omschrijving + "</label></p>");
                        $(".vakkenverveling").append("<p><input name='verveling' type='checkbox' id='v" + vak.afkorting + "' /><label for='v" + vak.afkorting + "'>" + vak.omschrijving + "</label></p>");
                    }
                });
            } else if (userinfo.ingevuld) {
                $(".magisterspinner").fadeOut("", function() {
                    $(".section.magister").fadeIn();
                    Materialize.toast('Je hebt de enquête al ingevuld!', 6000)
                });
            } else {
                setTimeout(function() {
                    $(".magisterspinner").fadeOut("", function() {
                        $(".section.magister").fadeIn();
                        Materialize.toast('Verkeerde gebruikersnaam of wachtwoord!', 4000)
                    });
                }, 1000);
            }
        })
        .fail(function() {
            setTimeout(function() {
                $(".magisterspinner").fadeOut("", function() {
                    $(".section.magister").fadeIn();
                    Materialize.toast('Geen internetverbinding', 4000)
                });
            }, 1000);
        })
}

function finishUp() {
    $.get("https://lu1t.nl/enquete.php?data=" + encodeURIComponent(JSON.stringify(antwoorden)), function(data) {
            $("#vraag1").fadeOut("", function() {
                $("#einde").fadeIn();
            });
        })
        .fail(function() {
            setTimeout(function() {
                Materialize.toast('Geen internetverbinding', 4000)
            }, 1000);
        })
}
$(document).ready(function() {
    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    $("#beginnen").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        $("#start").fadeOut("", function() {
            $("#magister").fadeIn();
        });
    });
    $("#login").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        $(".section.magister").fadeOut("", function() {
            $(".magisterspinner").fadeIn();
        });
        connectToMagister();
    });
    $("#volgende1").click(function() {
        var moeite = [];
        $("input:checkbox[name=moeite]:checked").each(function() {
            moeite.push($(this).attr('id').substr(1));
        });
        antwoorden.push(moeite);
        $("#vraag1").fadeOut("", function() {
            $("#vraag2").fadeIn();
        });
    });
    $("#volgende2").click(function() {
        var uitdaging = [];
        $("input:checkbox[name=uitdaging]:checked").each(function() {
            uitdaging.push($(this).attr('id').substr(1));
        });
        antwoorden.push(uitdaging);
        $("#vraag2").fadeOut("", function() {
            $("#vraag3").fadeIn();
        });
    });
    $("#volgende3").click(function() {
        var antwoord = $('input[name=vraag3]:checked').prop('id');
        if (antwoord.toLowerCase() == 'ja') {
            antwoorden.push($("#vraag3i").val().split(', '));
        } else {
            antwoorden.push({});
        }
        $("#vraag3").fadeOut("", function() {
            $("#vraag4").fadeIn();
        });
    });
    $("#volgende4").click(function() {
        var antwoord = $('input[name=vraag4]:checked').prop('id');
        if (antwoord.toLowerCase() == 'ja') {
            antwoorden.push($("#vraag4i").val().split(', '));
        } else {
            antwoorden.push({});
        }
        $("#vraag4").fadeOut("", function() {
            $("#vraag5").fadeIn();
        });
    });
    $("#volgende5").click(function() {
        var verveling = [];
        $("input:checkbox[name=verveling]:checked").each(function() {
            verveling.push($(this).attr('id').substr(1));
        });
        antwoorden.push(verveling);
        $("#vraag5").fadeOut("", function() {
            $("#vraag6").fadeIn();
        });
    });
    $("#klaar").click(function() {
        var antwoord = $('input[name=vraag6]:checked').prop('id');
        antwoorden.push(antwoord.toLowerCase());
        finishUp();
    });
});