import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Profile");
  }

  async getHtml() {
    //sitoje vietoje reiks pasiimti duomenis is database su fetch api arba ajax
    return `
    <div class="container rounded mt-5 mb-5">
    <div class="row">
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img class="rounded-circle mt-5 mb-2" width="200px" src="../static/media/green-velvet.jpg">
            <span class="user-name">Green Velvet</span>
            <span class="user-role">Manager</span>
            <span> </span>
          </div>
        </div>
        <div class="col-md-6 border-right">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h1 class="text-right">Profile Settings</h1>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6"><label class="labels">Name</label><input type="text" class="form-control" placeholder="first name" value=""></div>
                    <div class="col-md-6"><label class="labels">Surname</label><input type="text" class="form-control" value="" placeholder="surname"></div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12"><label class="labels">Phone Number</label><input type="text" class="form-control" placeholder="enter phone number" value=""></div>
                    <div class="col-md-12"><label class="labels">Address</label><input type="text" class="form-control" placeholder="enter address" value=""></div>
                    <div class="col-md-12"><label class="labels">Email</label><input type="email" class="form-control" placeholder="enter email" value=""></div>
                </div>
                <div class="mt-5 text-center"><button class="btn btn-lg btn-primary profile-button" type="button">Save Profile</button></div>
            </div>
        </div>
    </div>
</div>
</div>
</div>
    `;
  }
}
