class CreatePatternColors < ActiveRecord::Migration[5.0]
  def change
    create_table :pattern_colors do |t|
      t.integer :color_id
      t.integer :pattern_id
    end
  end
end
