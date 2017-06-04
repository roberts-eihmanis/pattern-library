class PatternsController < ApplicationController
  before_action :load_pattern, only: [:getrectarray, :getediturl]
  skip_before_filter :verify_authenticity_token

  def index
    @patterns = Pattern.all
    respond_to do |format|
      format.html
      format.json { render json: @patterns }
    end
  end

  def uploadfile
  end

  def getfilename
    
  end

  def uploadrectarray
    @upload_pattern = Pattern.new
    @upload_pattern.row_number = params[:array][:row_number]
    @upload_pattern.col_number = params[:array][:col_number]
    @upload_pattern.pattern_img = params[:array].to_json.to_s
    @upload_pattern.save

    respond_to do |format|
      if @upload_pattern.save
        format.html { redirect_to @upload_pattern }
        format.json { redirect_to @upload_pattern }
      else
        format.html { render :new }
        format.json { render json: @upload_pattern.errors, status: :unprocessable_entity }
      end
    end
  end

  def getrectarray
    respond_to do |format|
      format.html
      format.json { render json: @last_pattern }
    end
  end

  def getediturl
    puts @last_pattern
  end

  def get_edit
  end

  def create
    @pattern = Pattern.new

    respond_to do |format|
      if @pattern.save
        format.html { redirect_to @pattern, notice: 'Task was successfully created.' }
        format.json { redirect_to @pattern }
      else
        format.html { render :new }
        format.json { render json: @pattern.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def load_pattern
    @last_pattern = Pattern.last
  end

  def secure_params
    params.require(:pattern).permit(:name, :description, :row_number, :col_number, :user_id, :pattern_img)
  end
end