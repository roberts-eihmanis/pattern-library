class CreateColor < ActiveRecord::Migration[5.0]
  def change
    create_table :colors do |t|
      t.string :name
      t.integer :code
    end
  end
end
