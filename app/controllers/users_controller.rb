class UsersController < ApplicationController
  before_action :admin_only, :except => :show

  def index
    @users = User.all
    @patterns = Pattern.all
    respond_to do |format|
      format.html
      format.json { render json: @users }
    end
  end

  def show
    @user = User.find(params[:id])
    unless current_user.admin?
      unless @user == current_user
        redirect_to :back, :alert => "Access denied."
      end
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def new
    @roles = ['admin', 'user', 'worker']
    @user = User.new
  end

  def create
    @user = User.new(secure_params)
    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'Task was successfully created.' }
        format.json { redirect_to @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(secure_params)
      redirect_to @user, :notice => "User updated."
    else
      redirect_to @user, :alert => "Unable to update user."
    end
  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    redirect_to users_path, :notice => "User deleted."
  end

  private

  def admin_only
    unless current_user.admin?
      redirect_to :back, :alert => "Access denied."
    end
  end

  def secure_params
    params.require(:user).permit(:name, :surname, :user_name, :email, :password, :description, :role)
  end
end