function removeGSAccount() {
  const inputGSMail = document.getElementById('inputGSMail').value;
  const inputGSUsername = document.getElementById('inputGSUsername').value;

  $.ajax({
    url: '/removeGSAccount/' + inputGSMail + "/" + inputGSUsername,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      consoleLog("removeGSAccount client response from server : ", data);
      alert("the account has been removed");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      consoleLog("removeGSAccount error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("removeGSAccount error, textStatus : ", textStatus);
      consoleLog("removeGSAccount error, errorThrown : ", errorThrown);
      alert("an error occurred while removing the account");
    }
  });
}

function removeAccount() {
  const inputMail = document.getElementById('inputMail').value;
  const inputPassword = document.getElementById('inputPassword').value;

  $.ajax({
    url: '/removeAccount/' + inputMail + "/" + inputPassword,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      consoleLog("removeAccount client response from server : ", data);
      alert("the account has been removed");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      consoleLog("removeAccount error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("removeAccount error, textStatus : ", textStatus);
      consoleLog("removeAccount error, errorThrown : ", errorThrown);
      alert("an error occurred while removing the account");
    }
  });
}

function removeAccount2() {
  const inputUsername2 = document.getElementById('inputUsername2').value;
  const inputPassword2 = document.getElementById('inputPassword2').value;

  $.ajax({
    url: '/removeAccount2/' + inputUsername2 + "/" + inputPassword2,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      consoleLog("removeAccount2 client response from server : ", data);
      alert("the account has been removed");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      consoleLog("removeAccount2 error, XMLHttpRequest : ", XMLHttpRequest);
      consoleLog("removeAccount2 error, textStatus : ", textStatus);
      consoleLog("removeAccount2 error, errorThrown : ", errorThrown);
      alert("an error occurred while removing the account");
    }
  });
}
