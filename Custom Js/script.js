var Config = {
  "submissionURL": "https://workflow.dronahq.com/submission",
  "recordURL": "https://realtimedb.dronahq.com/couchdbs/cdb1952/documents/record_schema",
  "authToken": "56608519-b204-11e9-ac71-0a3cc2b8a100",
  "newAuthToken": "a0522413db4c59bbc34ac84ea8d8234b29fd8f3af549ac250c",
  "nextNewAuth": "35a35ad1ccd15ef778cc71542b8f573ab6b01bed4c2389bf38",
  "imgUpload": "https://plugin.api.dronahq.com/api/Imageupload",
  "tokenKey": "35a35ad1ccd15ef778cc71542b8f573ab6b01bed4c2389bf38",
  "userURL": "https://realtimedb.dronahq.com/couchdbs/cdb1952/documents/internal_schema",
  "userName": localStorage.getItem('uName'),
  "userEmail": localStorage.getItem('uEmail'),
  "userRole": localStorage.getItem('uRole')
};

var headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + Config.authToken
};

var fnHandleBars = function (template, data) {
  template = "#" + template;
  var Source = $(template).html();
  var fnTemplate = Handlebars.compile(Source);
  return fnTemplate(data);
};

var fnAjaxRequest = function (ajaxURL, ajaxReqMethod, ajaxReqHeader, ajaxReqData, onSucess, onError) {
  $.ajax({
      type: ajaxReqMethod,
      url: ajaxURL,
      headers: ajaxReqHeader,
      data: ajaxReqData,
      success: onSucess,
      error: onError
  });
};


function getLiveChallenges() {
  var obj = {
      "channel_id": "1952",
      "env": "prod",
      "table_id": "challenge_master_195215935_15644693509290",
      "table_name": "ChallengeMaster",
      "sort": [
          "row_seq"
      ],
      "fields": [
          "data.title_1564470459807",
          "data.description_1564470477939",
          "data.rewards_1564470493902",
          "data.pointsprize_1564470518709",
          "data.launch_date_1564470536666",
          "data.expertlist_1564553522952",
          "data.verticallist_1564553538937",
          "data.cash_prize_1564554871714.value",
          "data.cash_prize_1564554871714.unit",
          "data.other_reward_1564554894824",
          "data.end_date_1564555041269",
          "data.is_active_1564555207467",
          "data.challenge_status_1564570347858",
          "data.sheet_row_id",
          "data.challenge_image_1571305687863"
      ],
      "data_selector": {
          "$and": [{
              "data.challenge_status_1564570347858": {
                  "$eq": "Approved"
              }
          },
          {
              "data.ChallengeStartDateTime_1576833436097": {
                  "$lte": new Date().getTime()
              }
          },
          {
              "data.ChallengeEndDateTime_1576833451361": {
                  "$gte": new Date().getTime()
              }
          },
          {
              "data.verticallist_1564553538937": {
                  "$in": [
                      localStorage.getItem("uVertical")
                  ]
              }
          }
          ]
      }
  };

  var fnSuccess = function (resp) {
      if (resp.data.length == 0) {
          $("#nodatalive").removeClass("hide");
          $("#liveChallenges").addClass("hide");
      }
      else {
          $("#nodatalive").addClass("hide");
          $("#liveChallenges").removeClass("hide");
          var liveChallengeHtml = fnHandleBars("liveChallengesTemplate", resp.data.reverse());
          $('#liveChallenges').html(liveChallengeHtml);
          $("#currentChallengeCount").html(resp.data.length);
          console.log("response", resp.data)
      }

  };

  var fnError = function (err) {
      console.log('Some error occurred');
  };

  fnAjaxRequest(Config.recordURL, 'POST', headers, JSON.stringify(obj), fnSuccess, fnError);
}

function ideasShortListed() {
  var obj = {
      "channel_id": "1952",
      "env": "prod",
      "table_id": "idea_master_195215935_15647414449861",
      "table_name": "IdeaMaster",
      "sort": [
          "row_seq"
      ],
      "fields": [
          "data.sheet_row_id",
          "data.title_1564741592211",
          "data.description_1564741609064",
          "data.attachment_1564741697685",
          "data.Attachment_Name_1578911935713",
          "data.type_1564741769680",
          "data.challenge_unique_id_1564741795325",
          "data.Evaluation_status_1565681360482",
          "data.createdDate_1568728161813",
          "data.createdTime_1568728167166",
          "data.likesCount_1568976143088",
          "data.dislikeCount_1568976148019",
          "data.commentCount_1568976153187",
          "data.ShortlistedStatus_1569045037996",
          "data.IdeaSubmittedBy_1569225296900",
          "data.expertlist_1572875392350",
          "data.smeEvaluationPoints_1573477928934",
          "data.ChallengeTitle_1575956925650",
          "data.ChallengeCreatedBy_1576067258392",
          "data.EvaluationSubmittedBy_1576216154192",
          "data.SMEStartDate_1577103031268",
          "data.SMEEndDate_1577103041718",
          "data.PromoterStartDate_1577103084260",
          "data.PromoterEndDate_1577103094870",
          "data.VerticalList_1582113237931"
      ],
      "data_selector": {
          "data.ShortlistedStatus_1569045037996": {
              "$eq": "Winner"
          }
      }
  };

  var fnSuccess = function (resp) {
      $("#winnerIdeaCount").html(resp.data.length);

      var WinnersListHTML = fnHandleBars('winnersListTemplate', resp.data.reverse());
      $("#winnersList").html(WinnersListHTML);

  };

  var fnError = function (err) {
      console.log('Some error occurred');
  };

  fnAjaxRequest(Config.recordURL, 'POST', headers, JSON.stringify(obj), fnSuccess, fnError);
}
$(document).ready(function () {
  getLiveChallenges();
  ideasShortListed();
});