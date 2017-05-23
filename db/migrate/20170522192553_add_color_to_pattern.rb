class AddColorToPattern < ActiveRecord::Migration[5.0]
  def change
    add_column :patterns, :user_id, :integer
    add_column :patterns, :pattern_img, :text
  end
end
