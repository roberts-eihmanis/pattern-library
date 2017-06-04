class UsersController < ApplicationController
  # Atļaut tika adminam piekļūt pie Datiem, izņemot lietotājs var redzēt savu profilu
  before_action :admin_only, except: [:show, :profile]

  # Visu lietotāju atlasīšanas funkcija
  def index
    @users = User.all
    @patterns = Pattern.all
    respond_to do |format|
      format.html
      format.json { render json: @users }
    end
  end

  # Konkrētā lietotāja atlasīšanas funkcija
  def show
    @user = User.find(params[:id])
    unless current_user.admin?
      unless @user == current_user
        redirect_to :back, :alert => "Access denied."
      end
    end
  end

  # Lietotāja Profils
  def profile
    @user = User.find(params[:id])
  end

  # Lietotāja rediģēšanas funckija
  def edit
    @user = User.find(params[:id])
  end

  # Jauna lietotāja izveidošanas funckija
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

  # Atļaujam tikai konkrētos parametrus nodot datubāzei un atjaunot datus, vai izveidot no jauna
  def secure_params
    params.require(:user).permit(:name, :surname, :user_name, :email, :password, :description, :role)
  end
end