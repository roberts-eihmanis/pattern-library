class AddFileToPattern < ActiveRecord::Migration[5.0]
  def change
    add_column :patterns, :file, :string
  end
end
