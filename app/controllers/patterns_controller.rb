class PatternsController < ApplicationController

  def index
    @patterns = Pattern.all
    respond_to do |format|
      format.html
      format.json { render json: @patterns }
    end
  end

  def new
  end

  def new_from_img
  end

  def create
    @pattern = Pattern.new(secure_params)
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
end