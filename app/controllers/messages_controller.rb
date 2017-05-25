class MessagesController < ApplicationController
  def new
    @titles = ['Mr.', 'Mrs.', 'Ms.']
    @message = Message.new
  end
end