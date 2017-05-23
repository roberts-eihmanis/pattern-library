class CreatePattern < ActiveRecord::Migration[5.0]
  def change
    create_table :patterns do |t|
      t.string :name
      t.text :description
      t.integer :row_number
      t.integer :col_number
    end
  end
end
