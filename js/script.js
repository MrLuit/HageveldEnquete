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
                    if ($.inArray(vak.afkorting, ["me", "rt3F", "MS", "mvt"]) === -1 && vak.afkorting.indexOf("sl_") === -1 && vak.afkorting.indexOf("co_") === -1) { // WISA / WISAC        LO, HV, TE, MU, DR?
                        $(".vakkenmoeite").append("<p><input name='moeite' type='checkbox' id='" + vak.afkorting + "' /><label for='" + vak.afkorting + "'>" + vak.omschrijving + "</label></p>");
                    }
                });
			} else if(userinfo.ingevuld) {
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
        $("#start").fadeOut("", function() {
            $("#magister").fadeIn();
        });
    });
    $("#login").click(function() {
        $(".section.magister").fadeOut("", function() {
            $(".magisterspinner").fadeIn();
        });
        connectToMagister();
    });
	$("#volgende1").click(function() {
		moeite = [];
		$("input:checkbox[name=moeite]:checked").each(function(){
			moeite.push($(this).attr('id'));
		});
		antwoorden.push(moeite);
		//volgende vraag fadeOut fadeIn etc
	});
    $("#klaar").click(function() {
        finishUp();
    });
});