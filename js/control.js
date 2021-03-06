$(document).ready(function() {
  var assembleSidebarServerEntry = function (index, el) {
    var server = $('<div class="server py-1 px-2 mb-1" data-id="' + index + '"></div>');
    $(server).append('<p class="name mb-1 mr-1 d-inline-block">' + el['server-name'] + '</p>');
    $(server).append('<p class="user-count text-muted mb-1 d-inline-block">' + el['user-count'] + ' Users</p>')
    $(server).append('<p class="short-desc m-0 d-block">' + truncateStr(el['description'], 50) + '</p>');
    $(server).append('<p class="invite text-muted m-0 mt-1">(' + el['invite'] + ')</p>');

    serverList += server.get(0).outerHTML;
  }

  var exampleServerData = [
    {
      'description': '[Content deleted, to be written later]',
      'icon': {
        'type': 'icon',
        'content': 'https://cdn.discordapp.com/icons/259536826304430080/4ff1ea43ebffe2eae529610f282c560d.png',
        'text': 'C'
      },
      'rank': 1,
      'rating': 1,
      'server-name': "Cattlewater",
      'user-count': 4,
      'channel-count': 3,
      'invite': 'Gd4HBnT',
      'example-messages': [
        {
          channel: '#general',
          from: 'Teruko#9136',
          message: "This server is big. It can stay alive for another 30-100 days without anyone taking care, except for very few staff.\n\nServers revolves around activity. If there's no activity, RPers won't RP. They need more interaction.\nIf there's no activity all the time, they will go elsewhere, because they think it is solely up to the owners, which is halfy-right. They have to ensure activity, but you are the activity.\n\nI have more, but I'm lazy.\n\n**Idk**.\nRandom message.",
          timestamp: '1489143980'
        },
        {
          channel: '#beach1',
          from: 'ninjafrogtez#8775',
          message: "(including why my mind can't comprehend the reality of u choosing your current profile pic)",
          timestamp: '1489143060'
        },
        {
          channel: '#dreaming',
          from: 'Darkpuppy#9233',
          message: "*hes constantly smacking his head on the wall of the elevator*",
          timestamp: '1488346260'
        }
      ],
      'example-users': [
        {username: 'Alex', discriminator: '1571'},
        {username: 'Cherry The Meme', discriminator: '3763'},
        {username: 'Themayu', discriminator: '1563'},
        {username: 'Teruko', discriminator: '9136'}
      ]
    }
  ]

  var showEditor = function(e) {
    var $field = $($(this).data('field'));
    var $staticField = $($field.get(0));
    var $editor = $($field.get(1));

    $textboxSizingBox.appendTo($field.parent());
    if ($(this).data('field') !== '#control-frame .server-name') {
      $textboxSizingBox.removeClass('display-5');
    } else {
      $textboxSizingBox.addClass('display-5');
    }

    $editor.keyup(resizeTextBox);

    $(this).children('i').removeClass('fa-pencil').addClass('fa-floppy-o');
    $staticField.removeClass('d-inline-block');
    $editor.css({
      width: Math.ceil($staticField.width()),
      height: Math.ceil($staticField.height()*1.1)+2,
      fontFamily: $staticField.css('font-family')
    }).val($staticField.html()).addClass('d-inline-block');

    $(this).off('click').click(saveAndHideEditor);
  }

  var saveAndHideEditor = function(e) {
    var $field = $($(this).data('field'));
    var $staticField = $($field.get(0));
    var $editor = $($field.get(1));
    var fieldvalue = $editor.val();
    var cp = $('#control-frame');
    var id = parseInt(cp.attr('data-index'));

    $staticField.html(fieldvalue);
    exampleServerData[id][$editor.attr('name')] = fieldvalue;

    $editor.off('keyup');

    $(this).children('i').removeClass('fa-floppy-o').addClass('fa-pencil');
    $staticField.addClass('d-inline-block');
    $editor.removeClass('d-inline-block');

    buildServerList();

    $(this).off('click').click(showEditor);
  }

  var resizeTextBox = function(e) {
    var minWidth = 150;
    var currentWidth;
    var currentHeight;
    $textboxSizingBox.text($(this).val());
    currentWidth = $textboxSizingBox.width();
    currentHeight = $textboxSizingBox.height();

    $(this).css({
      width: ((currentWidth <= minWidth)? minWidth : currentWidth),
      height: currentHeight
    });
  }

  var showServerPanel = function() {
    var cp = $('#control-frame');
    var id = parseInt($(this).data('id'));
    cp.attr('data-index', id);

    var $serverName = cp.find('.server-name:not(textarea)');
    var $serverIcon = cp.find('.server-icon:not(textarea)');
    var $serverDesc = cp.find('.description:not(textarea)');
    var   $userList = cp.find('.user-list');
    var $statistics = cp.find('.stats-box');
    var    $msgList = cp.find('.messages');

    var $serverRatings = $statistics.find('.rating-number');
    var    $serverRank = $statistics.find('.rank-number');
    var $serverChanNum = $statistics.find('.channel-number');

    $serverName.text(exampleServerData[id]['server-name']);
    $serverIcon.empty();

    if (exampleServerData[id]['icon']['type'] === 'icon') {
      $serverIcon.append(
        '<img src="' +
        exampleServerData[id]['icon']['content'] +
        '" alt="' +
        exampleServerData[id]['server-name'] +
        ' icon" class="w-100 rounded icon" />'
      )
    } else {
      $serverIcon.append(
        '<div class="icon-text icon rounded" aria-label="' +
        exampleServerData[id]['server-name'] +
        ' icon"><p class="text">' +
        exampleServerData[id]['icon']['text']) +
        '</p></div>'
    }

    $serverDesc.text(exampleServerData[id]['description']);

    buildUserList(exampleServerData[id]['example-users']);
    buildMessageList(exampleServerData[id]['example-messages']);

    $serverRatings.text(exampleServerData[id]['rating']);
    $serverRank.text(exampleServerData[id]['rank']);
    $serverChanNum.text(exampleServerData[id]['channel-count']);

    cp.css({display: 'block'});

    cp.find('.server-name + .field-actions').click(showEditor);
    cp.find('.description + .field-actions').click(showEditor);
  }

  var serverList;
  var $textboxSizingBox = $('#textbox-sizing');

  var buildMessageList = function(messages) {
    var messageBox = $('.messages');
    messageBox.empty();

    $.each(messages, function(index, msg) {
      console.log('channel:', msg.channel);
      console.log('from:', msg.from);
      console.log('message:', parseMD(msg.message));
      console.log('timestamp:', msg.timestamp);

      var message = $('<div class="message small pb-05 px-1"></div>');
      var messageHeader = $('<div class="message-header"></div>');
      var messageContent = $('<div class="message-content small"></div>');
      var messageFooter = $('<div class="message-footer"></div>');

      var messageAuthor = $('<p class="message-author d-inline-block m-0"></p>');
      var messageChannel = $('<p class="message-channel d-inline-block m-0 ml-1"></p>');

      var messageTimestamp = $('<p class="message-timestamp m-0"></p>');

      var messageDate = new Date(msg.timestamp*1000);
      var formatDate = [
        (messageDate.getDate() <= 9)? '0'.concat(messageDate.getDate()) : messageDate.getDate(),
        (messageDate.getMonth() <= 9)? '0'.concat(messageDate.getMonth()) : messageDate.getMonth(),
        messageDate.getFullYear()
      ].join('/');
      var formatTime = [
        (messageDate.getHours() <= 9)? '0'.concat(messageDate.getHours()) : messageDate.getHours(),
        (messageDate.getMinutes() <= 9)? '0'.concat(messageDate.getMinutes()) : messageDate.getMinutes(),
        (messageDate.getSeconds() <= 9)? '0'.concat(messageDate.getSeconds()) : messageDate.getSeconds()
      ].join(':');

      messageTimestamp.text(formatDate + ' ' + formatTime).appendTo(messageFooter);
      messageAuthor.text('From ' + msg.from + ',').appendTo(messageHeader);
      messageChannel.text('in ' + msg.channel + '.').appendTo(messageHeader);
      messageContent.html('<p>' + parseMD(msg.message) + '</p>');

      messageHeader.appendTo(message);
      messageContent.appendTo(message);
      messageFooter.appendTo(message);

      message.appendTo(messageBox);
    });
  }
  var buildUserList = function(users) {
    var ul = $('.user-list');
    ul.empty();

    $.each(users, function(index, user) {
      var userDOM = $('<div class="user mb-1 px-1 py-05">' + user.username + '#' + user.discriminator + '</div>');
      userDOM.appendTo(ul);
      console.log(userDOM);
    });
  }
  var buildServerList = function() {
    serverList = '';
    var index = 0;

    $.each(exampleServerData, assembleSidebarServerEntry);

    $('#sidebar-server-list').html(serverList);

    $('.server', '#sidebar-server-list').click(showServerPanel);
  }

  buildServerList();
});
