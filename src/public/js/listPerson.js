document.addEventListener('DOMContentLoaded', function() {
    var CCCD;
    var deleteForm = document.forms['delete-citizen-form'];
    var btnDeleteCitizen = document.getElementById('btn-delete-citizen');

  $('#myModal').on('show.bs.modal', async function (event) {
    var button = $(event.relatedTarget);
    CCCD = button.data('id'); 
    let myObject = await fetch('/citizens/' + CCCD);
    let myText = await myObject.json();
    $('.modal-title').children().remove();
    $('.modal-body').children().remove();
    $('.modal-title').append("<h4>Thông tin người dân chi tiết</h4>");
    $('.modal-body').append('<h6>CCCD: ' + myText.CCCD + '</h6>');
    $('.modal-body').append('<p>Họ tên: ' + myText.name + '</p>');
    $('.modal-body').append('<p>SĐT: ' + myText.phone + '</p>');
    $('.modal-body').append('<p>Ngày sinh: ' + myText.date + '</p>');
    $('.modal-body').append('<p>Giới tính: ' + myText.sex + '</p>');
    $('.modal-body').append('<p>Nơi thường trú: ' + myText.perResidence + '</p>');
    $('.modal-body').append('<p>Nơi tạm trú: ' + myText.curResidence + '</p>');
    $('.modal-body').append('<p>Dân tộc: ' + myText.ethnic + '</p>');
    $('.modal-body').append('<p>Tôn giáo: ' + myText.religion + '</p>');
    $('.modal-body').append('<p>Trình độ văn hóa: ' + myText.eduLevel + '</p>');
    $('.modal-body').append('<p>Nghề nghiệp: ' + myText.job + '</p>');
    $('.modal-body').append('<p>Giới tính: ' + myText.sex + '</p>');
  });
    // when dialog confirm clicked
  $('#delete-citizen-modal').on('show.bs.modal', function (event) {
    $('.modal-title').children().remove();
    $('.modal-body').children().remove();
    var button = $(event.relatedTarget);
    CCCD = button.data('id');
});

//when delete citizen btn clicked
btnDeleteCitizen.onclick = function () {
  deleteForm.action = '/citizens/' + CCCD + '?_method=DELETE';
  deleteForm.submit();
};


});